const Address = require('../../models/Address');

// Add a new address
const addAddress = async (req, res) => {
  try {
    const { userId, address, city, pincode, phone, notes } = req.body;

    if (!userId || !address || !city || !pincode || !phone || !notes) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const newAddress = new Address({
      userId,
      address,
      city,
      pincode,
      phone,
      notes,
    });

    await newAddress.save();

    return res.status(201).json({
      success: true,
      message: "Address added successfully!",
      data: newAddress,
    });

  } catch (error) {
    console.error("Add Address Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding the address.",
    });
  }
};

// Fetch all addresses for a user
const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    const addressList = await Address.find({ userId });

    return res.status(200).json({
      success: true,
      data: addressList,
    });

  } catch (error) {
    console.error("Fetch Address Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching addresses.",
    });
  }
};

// Edit an existing address
const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const updatedData = req.body;

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Address ID are required.",
      });
    }

    const updatedAddress = await Address.findOneAndUpdate(
      { _id: addressId, userId },
      updatedData,
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address updated successfully!",
      data: updatedAddress,
    });

  } catch (error) {
    console.error("Edit Address Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while editing the address.",
    });
  }
};

// Delete an address
const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Address ID are required.",
      });
    }

    const deletedAddress = await Address.findOneAndDelete({
      _id: addressId,
      userId,
    });

    if (!deletedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully!",
    });

  } catch (error) {
    console.error("Delete Address Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the address.",
    });
  }
};

module.exports = {
  addAddress,
  fetchAllAddress,
  editAddress,
  deleteAddress,
};
