import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import Expense from "@/app/models/Expense";
import mongoose from "mongoose";

// GET single expense
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid expense ID" },
        { status: 400 }
      );
    }

    const expense = await Expense.findById(id);

    if (!expense) {
      return NextResponse.json(
        { message: "Expense not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(expense);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch expense" },
      { status: 500 }
    );
  }
}

// UPDATE expense
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid expense ID" },
        { status: 400 }
      );
    }

    const expense = await Expense.findByIdAndUpdate(
      id,
      {
        title: body.title,
        description: body.description,
        amount: Number(body.amount),
        category: body.category,
        expenseDate: body.expenseDate,
        paymentMethod: body.paymentMethod,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!expense) {
      return NextResponse.json(
        { message: "Expense not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Expense updated successfully",
      expense,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Update failed" },
      { status: 400 }
    );
  }
}

// DELETE expense
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid expense ID" },
        { status: 400 }
      );
    }

    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) {
      return NextResponse.json(
        { message: "Expense not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Expense deleted successfully",
    });
  } catch {
    return NextResponse.json(
      { message: "Delete failed" },
      { status: 500 }
    );
  }
}