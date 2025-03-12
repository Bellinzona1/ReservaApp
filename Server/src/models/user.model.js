const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    imageProfile: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/4792/4792929.png",
    },
    accountStatus: {
      type: String,
      enum: ["Cuenta gratis", "Cuenta Premium", "banned"],
      default: "Cuenta gratis",
    },
    emprendimiento: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Emprendimiento", // Conexión con el modelo Emprendimiento
      default: null, // Si el usuario no tiene, será null
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
