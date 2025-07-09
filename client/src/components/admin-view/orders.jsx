import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

import { useDispatch, useSelector } from 'react-redux';
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from '../../store/admin/orders-slice';
import AdminOrderDetailsView from './order-details';

const AdminOrdersView = () => {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const dispatch = useDispatch();
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);  

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  const handleViewDetails = (orderId) => {
    setSelectedOrderId(orderId);
    dispatch(getOrderDetailsForAdmin(orderId));
  };

  const handleCloseDialog = () => {
    setSelectedOrderId(null);
    dispatch(resetOrderDetails());
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto w-full">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>Order Price</TableHead>
                <TableHead>
                  <span className="sr-only">Details</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>

              {orderList && orderList.length > 0 ? (
                orderList.map((orderItem) => (
                  <TableRow key={orderItem._id}>
                    <TableCell>{orderItem._id}</TableCell>
                    <TableCell>{new Date(orderItem.orderDate).toLocaleDateString()}</TableCell>
                    <TableCell className={`capitalize font-medium ${orderItem.orderStatus === 'pending' ? 'text-red-500' : 'text-green-600'}`}>
                      {orderItem.orderStatus}
                    </TableCell>
                    <TableCell className="font-semibold">${orderItem.totalAmount}</TableCell>
                    <TableCell className="text-right">
                      <Dialog
                        open={selectedOrderId === orderItem._id}
                        onOpenChange={(open) => {
                          if (!open) handleCloseDialog();
                        }}
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
                            <AdminOrderDetailsView order={orderDetails} />
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
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminOrdersView;
