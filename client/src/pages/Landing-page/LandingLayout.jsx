import ShoppingFooter from "../../components/shopping-view/footer";
import ShoppingHeader from "../../components/shopping-view/header";


const LandingLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <ShoppingHeader />
      <main className="flex-grow pt-16 ">{children}</main>
      <ShoppingFooter />
    </div>
  );
};

export default LandingLayout;
