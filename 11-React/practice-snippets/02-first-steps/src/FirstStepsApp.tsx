import { ItemCounter } from './shopping-cart/ItemCounter'

interface ItemInCart {
    productName: string;
    quantity: number;
  }
  
  const itemsInCart: ItemInCart[] = [
    { productName: 'Nintendo Switch 2', quantity: 1 },
    { productName: 'Pro Controller', quantity: 2 },
    { productName: 'Super Smash', quantity: 5 },
  ];

export function FirstStepsApp() {
  return (
    <>
        <h1>Shopping cart</h1>
        {itemsInCart.map(({ productName, quantity }) => (
        <ItemCounter key={productName} name={productName} quantity={quantity} />
      ))}



        {/* <ItemCounter name="Nintendo" quantity={5}/>
        <ItemCounter name="Pro Controller" quantity={5}/>
        <ItemCounter name="Super Smash" quantity={5}/> */}
    </>
  );
}

    