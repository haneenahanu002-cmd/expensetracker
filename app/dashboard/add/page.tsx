import ExpenseForm from "@/app/components/ExpenseForm";

export default function AddExpense() {
  return (
    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-2">
        Add New Expense
      </h1>

      <p className="text-gray-500 mb-6">
        Enter your daily expense details.
      </p>

      <ExpenseForm key="add-expense" />

    </div>
  );
}