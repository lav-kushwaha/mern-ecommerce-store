import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  return (
    <Card className="w-full max-w-xs mx-auto rounded-xl overflow-hidden shadow-sm border bg-white">
      {/* Image (fixed height + containment) */}
      <div className="w-full h-72 bg-muted/10 flex items-center justify-center">
        <img
          src={product?.image}
          alt={product?.title}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Details */}
      <CardContent className="p-3 space-y-1">
        <h2 className="text-base font-semibold truncate">{product?.title}</h2>
        <p className="text-xs text-muted-foreground truncate">Brand: {product?.brand}</p>
        <p className="text-xs text-muted-foreground truncate">Category: {product?.category}</p>

        <div className="flex justify-between items-center mt-1">
          <span
            className={`${
              product?.salePrice > 0
                ? "line-through text-muted-foreground"
                : "text-primary"
            } text-sm font-medium`}
          >
            ₹{product?.price}
          </span>
          {product?.salePrice > 0 && (
            <span className="text-sm font-semibold text-green-600">
              ₹{product?.salePrice}
            </span>
          )}
        </div>
      </CardContent>

      {/* Actions */}
      <CardFooter className="flex justify-between px-3 pb-3">
        <Button
          size="sm"
          className="cursor-pointer"
          onClick={() => {
            setOpenCreateProductsDialog(true);
            setCurrentEditedId(product?._id);
            setFormData(product); 
          }}
        >
          Edit
        </Button>
        <Button
        className="cursor-pointer"
          size="sm"
          variant="destructive"
          onClick={() => handleDelete(product?._id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AdminProductTile;
