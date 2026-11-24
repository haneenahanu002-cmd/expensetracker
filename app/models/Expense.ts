import mongoose, { Schema, models, model } from "mongoose";

const expenseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: [0.01, "Amount must be positive"],
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Food",
        "Transportation",
        "Shopping",
        "Entertainment",
        "Healthcare",
        "Education",
        "Others",
      ],
    },

    expenseDate: {
      type: Date,
      required: true,
    },

    paymentMethod: {
      type: String,
      required: true,
      enum: [
        "Cash",
        "Credit Card",
        "Debit Card",
        "UPI",
        "Net Banking",
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Expense =
  models.Expense || model("Expense", expenseSchema);

export default Expense;