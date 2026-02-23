# 12 — PostgreSQL with Django

---

## 📦 Setup

```bash
pip install psycopg2-binary django python-decouple
```

```env
# .env
DATABASE_URL=postgresql://postgres:password@localhost:5432/mydb
DB_NAME=mydb
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
```

```python
# settings.py
from decouple import config

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME':     config('DB_NAME'),
        'USER':     config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST':     config('DB_HOST', default='localhost'),
        'PORT':     config('DB_PORT', default='5432'),
        # Production extras
        'CONN_MAX_AGE': 60,       # reuse connections for 60s
        'OPTIONS': {
            'connect_timeout': 5,
        },
    }
}
```

---

## 🏗 Models → Schema

Django models map directly to Postgres tables.

```python
# models.py
import uuid
from django.db import models


class User(models.Model):
    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email      = models.EmailField(unique=True)
    name       = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)  # soft delete

    class Meta:
        db_table = 'users'
        indexes  = [
            models.Index(fields=['email']),
        ]

    def __str__(self):
        return self.email


class Account(models.Model):
    id       = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user     = models.ForeignKey(User, on_delete=models.PROTECT, related_name='accounts')
    balance  = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    currency = models.CharField(max_length=3, default='USD')
    status   = models.CharField(max_length=20, default='active')

    class Meta:
        db_table = 'accounts'
        constraints = [
            models.CheckConstraint(
                check=models.Q(balance__gte=0),
                name='balance_non_negative'
            )
        ]


class Transaction(models.Model):
    TYPES = [('transfer', 'Transfer'), ('deposit', 'Deposit'), ('withdrawal', 'Withdrawal')]

    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    from_account    = models.ForeignKey(Account, on_delete=models.PROTECT, related_name='sent',     null=True)
    to_account      = models.ForeignKey(Account, on_delete=models.PROTECT, related_name='received', null=True)
    amount          = models.DecimalField(max_digits=15, decimal_places=2)
    type            = models.CharField(max_length=20, choices=TYPES)
    status          = models.CharField(max_length=20, default='pending')
    metadata        = models.JSONField(default=dict, blank=True)  # JSONB in Postgres
    created_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'transactions'
        indexes  = [
            models.Index(fields=['from_account', 'created_at']),
            models.Index(fields=['to_account',   'created_at']),
        ]
        constraints = [
            models.CheckConstraint(
                check=models.Q(amount__gt=0),
                name='positive_amount'
            )
        ]
```

---

## 🔄 Migrations

```bash
python manage.py makemigrations    # generate migration files
python manage.py migrate           # apply to database
python manage.py showmigrations    # see migration status
python manage.py sqlmigrate app 0001  # preview SQL that will run
```

---

## 🔎 ORM Queries (Django → SQL)

### Basic CRUD

```python
from myapp.models import User, Account, Transaction

# CREATE
user = User.objects.create(email='ana@example.com', name='Ana')

# READ
user  = User.objects.get(id='some-uuid')          # raises DoesNotExist if not found
users = User.objects.filter(deleted_at__isnull=True)
user  = User.objects.filter(email='ana@example.com').first()  # returns None if not found

# UPDATE
User.objects.filter(id=user.id).update(name='Ana García')
# or
user.name = 'Ana García'
user.save()

# DELETE (hard)
User.objects.filter(id=user.id).delete()

# Soft delete
from django.utils import timezone
User.objects.filter(id=user.id).update(deleted_at=timezone.now())
```

### Filtering

```python
# WHERE equivalents
User.objects.filter(name='Ana')                     # WHERE name = 'Ana'
User.objects.filter(name__icontains='ana')          # WHERE name ILIKE '%ana%'
User.objects.filter(name__startswith='An')          # WHERE name LIKE 'An%'
User.objects.filter(created_at__date=today)         # WHERE created_at::date = today
User.objects.filter(balance__gte=100)               # WHERE balance >= 100
User.objects.filter(balance__range=(100, 500))      # WHERE balance BETWEEN 100 AND 500
User.objects.exclude(deleted_at__isnull=False)      # WHERE deleted_at IS NULL
User.objects.filter(status__in=['active','vip'])    # WHERE status IN ('active','vip')

# AND
User.objects.filter(balance__gte=100, status='active')

# OR (requires Q objects)
from django.db.models import Q
User.objects.filter(Q(balance__gte=100) | Q(status='vip'))

# NOT
User.objects.filter(~Q(status='banned'))
```

### Ordering, Limiting, Pagination

```python
# ORDER BY
User.objects.order_by('name')          # ASC
User.objects.order_by('-created_at')   # DESC

# LIMIT / OFFSET
User.objects.all()[:10]                # LIMIT 10
User.objects.all()[20:30]             # LIMIT 10 OFFSET 20

# Pagination with Django Paginator
from django.core.paginator import Paginator

paginator = Paginator(User.objects.filter(deleted_at__isnull=True), 20)
page = paginator.get_page(request.GET.get('page', 1))
```

### Aggregations

```python
from django.db.models import Sum, Count, Avg, Max, Min

# Total revenue
Transaction.objects.filter(status='success').aggregate(total=Sum('amount'))
# → {'total': Decimal('12345.67')}

# Stats in one query
Transaction.objects.aggregate(
    total=Sum('amount'),
    count=Count('id'),
    average=Avg('amount'),
    maximum=Max('amount'),
)

# Group by (annotate)
from django.db.models.functions import TruncMonth

Transaction.objects \
    .annotate(month=TruncMonth('created_at')) \
    .values('month') \
    .annotate(revenue=Sum('amount'), count=Count('id')) \
    .order_by('month')
```

### JOINs (select_related & prefetch_related)

```python
# INNER JOIN — single FK (one query with JOIN)
transactions = Transaction.objects.select_related('from_account', 'to_account')

for tx in transactions:
    print(tx.from_account.balance)  # no extra query!

# Prefetch — reverse FK or M2M (two optimized queries)
users = User.objects.prefetch_related('accounts')

for user in users:
    print(user.accounts.all())  # no N+1 problem!
```

> ⚠️ Without `select_related` / `prefetch_related` you get the N+1 problem — Django fires one query per row.

---

## 💸 Transactions (Atomic)

```python
from django.db import transaction
from decimal import Decimal

def transfer_funds(from_account_id, to_account_id, amount):
    with transaction.atomic():
        # Lock both rows for update
        from_acc = Account.objects.select_for_update().get(id=from_account_id)
        to_acc   = Account.objects.select_for_update().get(id=to_account_id)

        if from_acc.balance < amount:
            raise ValueError('Insufficient funds')

        from_acc.balance -= Decimal(amount)
        to_acc.balance   += Decimal(amount)

        from_acc.save()
        to_acc.save()

        Transaction.objects.create(
            from_account=from_acc,
            to_account=to_acc,
            amount=amount,
            type='transfer',
            status='completed',
        )
```

### Savepoints

```python
from django.db import transaction

with transaction.atomic():
    user = User.objects.create(email='test@example.com', name='Test')

    try:
        with transaction.atomic():  # creates a savepoint
            Account.objects.create(user=user, balance=-100)  # will fail CHECK constraint
    except Exception:
        pass  # inner block rolled back, outer continues

    # user was still created
```

---

## 🔥 Raw SQL (When ORM isn't Enough)

```python
from django.db import connection

# Raw query with parameters (safe — parameterized)
with connection.cursor() as cursor:
    cursor.execute("""
        SELECT u.name, SUM(t.amount) AS total_spent
        FROM users u
        JOIN transactions t ON t.from_account_id IN (
            SELECT id FROM accounts WHERE user_id = u.id
        )
        WHERE t.created_at > NOW() - INTERVAL '30 days'
        GROUP BY u.id, u.name
        ORDER BY total_spent DESC
        LIMIT %s
    """, [10])

    rows = cursor.fetchall()
    columns = [col[0] for col in cursor.description]
    results = [dict(zip(columns, row)) for row in rows]

# Raw ORM (maps to model instances)
users = User.objects.raw(
    'SELECT * FROM users WHERE balance > %s', [1000]
)
```

---

## 📊 JSONB in Django

Django's `JSONField` uses Postgres JSONB automatically.

```python
# Model
class Payment(models.Model):
    data = models.JSONField(default=dict)

# Insert
Payment.objects.create(data={
    'method': 'credit_card',
    'last4': '4242',
    'brand': 'Visa'
})

# Query JSONB fields
Payment.objects.filter(data__method='credit_card')
Payment.objects.filter(data__brand='Visa')
Payment.objects.filter(data__amount__gte=100)

# Key existence
Payment.objects.filter(data__has_key='discount')

# Nested
Payment.objects.filter(data__shipping__country='US')
```

---

## 🪟 Window Functions in Django

```python
from django.db.models import Window, Sum, F
from django.db.models.functions import Rank

# Running total per user
Transaction.objects.annotate(
    running_total=Window(
        expression=Sum('amount'),
        partition_by=[F('from_account__user')],
        order_by=F('created_at').asc(),
    )
).values('id', 'amount', 'created_at', 'running_total')

# Rank users by balance
Account.objects.annotate(
    rank=Window(
        expression=Rank(),
        order_by=F('balance').desc()
    )
).values('user__name', 'balance', 'rank')
```

---

## 🔍 Full-Text Search in Django

```python
# Install
# Already included in django.contrib.postgres

from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank

# Basic search
from myapp.models import Article

Article.objects.annotate(
    search=SearchVector('title', 'content')
).filter(search='database')

# With ranking
vector = SearchVector('title', weight='A') + SearchVector('content', weight='B')
query  = SearchQuery('postgres performance')

Article.objects.annotate(
    rank=SearchRank(vector, query)
).filter(rank__gte=0.1).order_by('-rank')
```

---

## ⚡ Performance Tips for Django + Postgres

```python
# 1. Only fetch needed columns
User.objects.values('id', 'email')          # dict
User.objects.values_list('id', flat=True)   # list of IDs

# 2. Check if exists (don't fetch the object)
if User.objects.filter(email='x@x.com').exists():
    ...

# 3. Bulk create (one INSERT, not N)
User.objects.bulk_create([
    User(email='a@a.com', name='A'),
    User(email='b@b.com', name='B'),
    User(email='c@c.com', name='C'),
])

# 4. Bulk update
User.objects.filter(status='trial').update(status='expired')

# 5. Use iterator for large querysets (no memory overload)
for user in User.objects.filter(active=True).iterator(chunk_size=1000):
    process(user)

# 6. Defer heavy fields
User.objects.defer('large_text_field', 'avatar_data')

# 7. Count without loading objects
User.objects.filter(active=True).count()
```

---

## 🛠 Useful Django + Postgres Management Commands

```bash
# Create database
createdb mydb

# Run migrations
python manage.py migrate

# Open Django shell
python manage.py shell

# Open Postgres shell connected to your Django DB
python manage.py dbshell

# Dump data
python manage.py dumpdata myapp > backup.json

# Load data
python manage.py loaddata backup.json

# Reset migrations (dev only)
python manage.py migrate myapp zero
python manage.py makemigrations myapp
python manage.py migrate myapp
```

---

## 📋 ORM → SQL Quick Reference

| Django ORM | SQL |
| :------------ | :----- |
| `filter(name='Ana')` | `WHERE name = 'Ana'` |
| `exclude(status='banned')` | `WHERE status != 'banned'` |
| `order_by('-created_at')` | `ORDER BY created_at DESC` |
| `[:10]` | `LIMIT 10` |
| `[20:30]` | `LIMIT 10 OFFSET 20` |
| `aggregate(Sum('amount'))` | `SELECT SUM(amount)` |
| `annotate(total=Sum('amount'))` | `SELECT SUM(amount) ... GROUP BY` |
| `select_related('user')` | `JOIN users` |
| `prefetch_related('orders')` | Two queries, combined in Python |
| `select_for_update()` | `SELECT ... FOR UPDATE` |
| `transaction.atomic()` | `BEGIN ... COMMIT` |
| `bulk_create([...])` | `INSERT INTO ... VALUES (...),(...)` |

---
