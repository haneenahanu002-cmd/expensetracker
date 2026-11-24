"use client";

import { useState , useEffect} from "react";
import { useRouter } from "next/navigation";
import api from "../lib/axios";
import toast from "react-hot-toast";


interface ExpenseData {
  _id?: string;
  title: string;
  description: string;
  amount: number;
  category: string;
  expenseDate: string;
  paymentMethod: string;
}

interface Props {
  initialData?: ExpenseData;
  isEdit?: boolean;
}

const categories = [
  "Food",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Healthcare",
  "Education",
  "Others",
];

const paymentMethods = [
  "Cash",
  "Credit Card",
  "Debit Card",
  "UPI",
  "Net Banking",
];

export default function ExpenseForm({
  initialData,
  isEdit = false,
}: Props) {
  const router = useRouter();

 const [form, setForm] = useState({
  title: isEdit ? initialData?.title || "" : "",
  description: isEdit ? initialData?.description || "" : "",
  amount: isEdit ? initialData?.amount?.toString() || "" : "",
  category: isEdit ? initialData?.category || "" : "",
  expenseDate: isEdit && initialData?.expenseDate
    ? new Date(initialData.expenseDate).toISOString().split("T")[0]
    : "",
  paymentMethod: isEdit ? initialData?.paymentMethod || "" : "",
});
useEffect(() => {
  if (!isEdit) {
    setForm({
      title: "",
      description: "",
      amount: "",
      category: "",
      expenseDate: "",
      paymentMethod: "",
    });
  }
}, [isEdit]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (Number(form.amount) <= 0) {
      setMessage("Amount must be greater than zero");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      if (isEdit && initialData?._id) {
        await api.patch(
          `/expenses/${initialData._id}`,
          {
            ...form,
            amount: Number(form.amount),
          }
        );

        toast.success("Expense updated successfully");
      } else {
        await api.post("/expenses", {
          ...form,
          amount: Number(form.amount),
        });

        toast.success("Expense added successfully");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      setMessage(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="block mb-2 font-medium">
            Expense Title
          </label>

          <input
            type="text"
            name="title"
            placeholder="Enter expense title"
            value={form.title}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Description
          </label>

          <textarea
            name="description"
            placeholder="Enter description"
            value={form.description}
            onChange={handleChange}
            className={inputClass}
            rows={3}
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-5">

          <div>
            <label className="block mb-2 font-medium">
              Amount (₹)
            </label>

            <input
              type="number"
              name="amount"
              placeholder="Enter amount"
              value={form.amount}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Category
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select Category</option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Expense Date
            </label>

            <input
              type="date"
              name="expenseDate"
              value={form.expenseDate}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Payment Method
            </label>

            <select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select Payment Method</option>

              {paymentMethods.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

        </div>

        {message && (
          <p className="text-red-600 text-sm">{message}</p>
        )}

        <div className="flex gap-3">

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : isEdit
              ? "Update Expense"
              : "Add Expense"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="bg-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>

        </div>

      </form>
    </div>
  );
}