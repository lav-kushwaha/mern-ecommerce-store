import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

// Styles for PDF
const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  bold: {
    fontWeight: 'bold',
  },
});

const OrderDetailsPDF = ({ order }) => {
  const {
    _id,
    userName,
    orderDate,
    totalAmount,
    orderStatus,
    cartItems = [],
    addressInfo = {},
    paymentMethod,
    paymentStatus,
  } = order;

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        {/* Order Summary */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.title}>Order Summary</Text>
          <Text>Order ID: {_id}</Text>
          <Text>Date: {new Date(orderDate).toLocaleDateString()}</Text>
          <Text>Total Amount: ${totalAmount}</Text>
          <Text>Status: {orderStatus}</Text>
          <Text>Payment Method: {paymentMethod}</Text>
          <Text>Payment Status: {paymentStatus}</Text>
        </View>

        {/* Shipping Info */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.title}>Shipping Info</Text>
          <Text>Name: {userName || 'N/A'}</Text>
          <Text>Address: {addressInfo.address}</Text>
          <Text>City: {addressInfo.city}</Text>
          <Text>Pincode: {addressInfo.pincode}</Text>
          <Text>Phone: {addressInfo.phone}</Text>
          <Text>Notes: {addressInfo.notes}</Text>
        </View>

        {/* Cart Items */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.title}>Items</Text>
          {cartItems.map((item, idx) => (
            <View key={idx} style={pdfStyles.row}>
              <Text>{item.title} (x{item.quantity})</Text>
              <Text>${item.price}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default OrderDetailsPDF;
