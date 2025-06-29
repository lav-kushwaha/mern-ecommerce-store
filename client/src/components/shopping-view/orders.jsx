import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'

const Orders = () => {
  return (
      <Card>
        <CardHeader>
            <CardTitle>All Orders</CardTitle>
        </CardHeader>
         <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>Order Price</TableHead>
                <TableHead>
                   <span className='sr-only'>Details</span>
                </TableHead>
                </TableRow>
            </TableHeader>
             <TableBody>
               <TableRow>
                    <TableCell>123456</TableCell>
                    <TableCell>21/23/2001</TableCell>
                    <TableCell>In Process</TableCell>
                    <TableCell>200k</TableCell>
                    <TableCell>
                        <Button>
                            View Details
                        </Button>
                    </TableCell>
                </TableRow> 
             </TableBody>  
            </Table>
        </CardContent>
     </Card>
  )
}

export default Orders