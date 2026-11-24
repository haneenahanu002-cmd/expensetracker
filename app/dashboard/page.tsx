"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import api from "../lib/axios";
import toast from "react-hot-toast";


interface Expense {
  _id: string;
  title: string;
  description: string;
  amount: number;
  category: string;
  expenseDate: string;
  paymentMethod: string;
}

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [payment, setPayment] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      const response = await api.get("/expenses");
      setExpenses(response.data);
    } catch {
      alert("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Delete expense
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/expenses/${id}`);

      setExpenses((prev) =>
        prev.filter((expense) => expense._id !== id)
      );

     toast.success("Expense deleted successfully");
    } catch {
      toast.error("Failed to delete expense");
    }
  };

  // Search and Filters
  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const searchMatch =
        expense.title.toLowerCase().includes(search.toLowerCase()) ||
        expense.description.toLowerCase().includes(search.toLowerCase());

      const categoryMatch =
        category === "All Categories" ||
        expense.category === category;

      const paymentMatch =
        payment === "All" ||
        expense.paymentMethod === payment;

      const expenseDate = new Date(expense.expenseDate);
      const today = new Date();

      const startOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      const startOfWeek = new Date(startOfToday);

      // Monday as start of week
      const day = startOfWeek.getDay();
      startOfWeek.setDate(
        startOfWeek.getDate() - (day === 0 ? 6 : day - 1)
      );

      const startOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

      let dateMatch = true;

      if (dateFilter === "Today") {
        dateMatch = expenseDate >= startOfToday &&
          expenseDate < new Date(startOfToday.getTime() + 86400000);
      }

      if (dateFilter === "This Week") {
        dateMatch =
          expenseDate >= startOfWeek &&
          expenseDate < new Date(startOfToday.getTime() + 86400000);
      }

      if (dateFilter === "This Month") {
        dateMatch =
          expenseDate >= startOfMonth &&
          expenseDate < new Date(today.getFullYear(), today.getMonth() + 1, 1);
      }

      return (
        searchMatch &&
        categoryMatch &&
        paymentMatch &&
        dateMatch
      );
    });
  }, [expenses, search, category, payment, dateFilter]);

  // Dashboard Summary (based on ALL expenses)
  const totalCount = expenses.length;

  const totalAmount = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const highestExpense =
    expenses.length > 0
      ? Math.max(...expenses.map((expense) => expense.amount))
      : 0;

  const averageExpense =
    totalCount > 0 ? totalAmount / totalCount : 0;

  const formatAmount = (amount: number) =>
    "₹" + amount.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN");

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Expense Tracker
            </h1>

            <p className="text-sm text-gray-500">
              Manage your daily expenses
            </p>
          </div>

          <Link
            href="/dashboard/add"
            className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
          >
            + Add Expense
          </Link>

        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-gray-500 text-sm">
              Total Expenses
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {totalCount}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-gray-500 text-sm">
              Total Amount
            </p>

            <h2 className="text-3xl font-bold mt-2 text-blue-600">
              {formatAmount(totalAmount)}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-gray-500 text-sm">
              Highest Expense
            </p>

            <h2 className="text-3xl font-bold mt-2 text-red-500">
              {formatAmount(highestExpense)}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-gray-500 text-sm">
              Average Expense
            </p>

            <h2 className="text-3xl font-bold mt-2 text-green-600">
              {formatAmount(averageExpense)}
            </h2>
          </div>

        </div>

        {/* Search and Filters */}
        <div className="bg-white p-5 rounded-xl shadow-sm mb-6">

          <h2 className="text-xl font-semibold mb-4">
            Search & Filter Expenses
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Search */}
            <input
              type="text"
              placeholder="Search title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded-lg px-4 py-3"
            >
              <option>All Categories</option>
              <option>Food</option>
              <option>Transportation</option>
              <option>Shopping</option>
              <option>Entertainment</option>
              <option>Healthcare</option>
              <option>Education</option>
              <option>Others</option>
            </select>

            {/* Payment */}
            <select
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              className="border rounded-lg px-4 py-3"
            >
              <option>All</option>
              <option>Cash</option>
              <option>Credit Card</option>
              <option>Debit Card</option>
              <option>UPI</option>
              <option>Net Banking</option>
            </select>

            {/* Date */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border rounded-lg px-4 py-3"
            >
              <option>All</option>
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>

          </div>

          <button
            onClick={() => {
              setSearch("");
              setCategory("All Categories");
              setPayment("All");
              setDateFilter("All");
            }}
            className="mt-4 text-blue-600 font-medium hover:underline"
          >
            Clear Filters
          </button>

        </div>

        {/* Expenses Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

          <div className="p-5 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Recent Expenses
            </h2>

            <span className="text-sm text-gray-500">
              {filteredExpenses.length} records
            </span>
          </div>

          {loading ? (
            <p className="text-center py-10">
              Loading expenses...
            </p>
          ) : filteredExpenses.length === 0 ? (

            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                No expenses found.
              </p>

              <Link
                href="/dashboard/add"
                className="text-blue-600 font-medium"
              >
                Add your first expense
              </Link>
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4">Title</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredExpenses.map((expense) => (

                    <tr
                      key={expense._id}
                      className="border-t hover:bg-gray-50"
                    >

                      <td className="p-4">
                        <p className="font-medium">
                          {expense.title}
                        </p>

                        <p className="text-xs text-gray-500 max-w-40 truncate">
                          {expense.description}
                        </p>
                      </td>

                      <td className="p-4 font-semibold text-red-600">
                        {formatAmount(expense.amount)}
                      </td>

                      <td className="p-4">
                        {expense.category}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        {formatDate(expense.expenseDate)}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        {expense.paymentMethod}
                      </td>

                      <td className="p-4">
                        <div className="flex gap-3">

                          <Link
                            href={`/dashboard/edit/${expense._id}`}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() =>
                              handleDelete(expense._id)
                            }
                            className="text-red-600  hover:underline"
                          >
                            Delete
                          </button>

                        </div>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </main>

    </div>
  );
}