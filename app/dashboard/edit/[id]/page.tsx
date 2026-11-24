
"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/app/lib/axios";

function EditExpenseForm() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [expenseDate, setExpenseDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await api.get(`/expenses/${id}`);
        const expense = response.data;

        setTitle(expense.title);
        setDescription(expense.description);
        setAmount(String(expense.amount));
        setCategory(expense.category);
        setExpenseDate(
          new Date(expense.expenseDate).toISOString().split("T")[0]
        );
        setPaymentMethod(expense.paymentMethod);
      } catch {
        toast.error("Expense not found");
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !description.trim() ||
      !amount ||
      Number(amount) <= 0 ||
      !expenseDate
    ) {
      toast.error("Please fill all fields correctly");
      return;
    }

    try {
      await api.patch(`/expenses/${id}`, {
        title,
        description,
        amount: Number(amount),
        category,
        expenseDate,
        paymentMethod,
      });

      toast.success("Expense updated successfully!");
      router.push("/dashboard");
    } catch {
      toast.error("Failed to update expense");
    }
  };

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Edit Expense
        </h1>

        <p className="text-gray-500 mb-8">
          Update your expense details
        </p>

        <form onSubmit={handleUpdate} className="space-y-5">

          <div>
            <label className="block font-semibold mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Enter title"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
              rows={4}
              placeholder="Enter description"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Enter amount"
              min="0.01"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
            >
              <option>Food</option>
              <option>Transportation</option>
              <option>Shopping</option>
              <option>Entertainment</option>
              <option>Healthcare</option>
              <option>Education</option>
              <option>Others</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">Expense Date</label>
            <input
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
            >
              <option>Cash</option>
              <option>Credit Card</option>
              <option>Debit Card</option>
              <option>UPI</option>
              <option>Net Banking</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Update Expense
            </button>

            <Link
              href="/dashboard"
              className="flex-1 text-center bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold py-3 hover:bg-gray-300"
            >
              Cancel
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}

export default function EditExpense() {
  return (
    <Suspense fallback={<p className="p-6">Loading...</p>}>
      <EditExpenseForm />
    </Suspense>
  );
}
