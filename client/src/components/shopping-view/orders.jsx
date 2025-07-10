import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogContent,
} from '../ui/dialog';
import { Button } from '../ui/button';
import ShoppingOrderDetailsView from './order-details';
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from '../../store/shop/order-slice';

const ShoppingOrders = () => {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shoppingOrder);

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllOrdersByUserId(user._id));
    }
  }, [dispatch, user?._id]);

  const handleViewDetails = (orderId) => {
    setSelectedOrderId(orderId);
    dispatch(getOrderDetails(orderId));
  };

  const closeDialog = () => {
    setSelectedOrderId(null);
    dispatch(resetOrderDetails());
  };

  return (
    <Card className="w-full max-w-7xl mx-auto my-4 p-4 sm:p-6 lg:p-8 shadow-md rounded-xl">
      <CardHeader className="mb-4">
        <CardTitle className="text-xl sm:text-2xl font-semibold text-center sm:text-left">
          Your Orders
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table className="min-w-[600px] w-full text-sm sm:text-base">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Order ID</TableHead>
              <TableHead className="whitespace-nowrap">Order Date</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="whitespace-nowrap">Total</TableHead>
              <TableHead className="whitespace-nowrap text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0 ? (
              orderList.map((orderItem) => (
                <TableRow key={orderItem._id}>
                  <TableCell>{orderItem._id}</TableCell>
                  <TableCell>
                    {new Date(orderItem.orderDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell
                    className={`capitalize font-medium ${
                     ['pending', 'rejected'].includes( orderItem.orderStatus )
                        ? 'text-red-500'
                        : 'text-green-600'
                    }`}
                  >
                    {orderItem.orderStatus}
                  </TableCell>
                  <TableCell className="font-semibold">
                    ${orderItem.totalAmount}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog
                      open={selectedOrderId === orderItem._id}
                      onOpenChange={(open) => !open && closeDialog()}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(orderItem._id)}
                          className="hover:bg-primary hover:text-white transition"
                        >
                        View Details
                      </Button>
                      </DialogTrigger>
                      <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-base sm:text-lg font-semibold">
                          Order Details
                        </DialogTitle>
                      </DialogHeader>
                      <ShoppingOrderDetailsView order={orderDetails} />
                    </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="5" className="text-center text-gray-500 py-6">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ShoppingOrders;
