"use client";
import React, { useState } from "react";
import { Eye, ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/hooks/axios";
import { useQuery } from "@tanstack/react-query";
import { initiateKhaltiCredit, initiateKhaltiPayment } from "@/hooks/khalti";

export default function TutorMeWallet() {
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [loadAmount, setLoadAmount] = useState("2000");
  const [selectedWallet, setSelectedWallet] = useState("khalti");
  const [isLoading, setIsLoading] = useState(false);

  const user = useAuthStore((state) => state.user);

  // Fetch wallet data
  const {
    data: walletData,
    isLoading: walletLoading,
    error: walletError,
    refetch,
  } = useQuery({
    queryKey: ["wallet-data"],
    queryFn: async () => {
      const res = await api.get(`/auth/user/${user?.id}`);
      return res.data.data;
    },
  });

  // Fetch transactions
  const { data: transactionsData, isLoading: transactionsLoading,refetch:refetchTransactions } = useQuery({
    queryKey: ["transactions", activeTab, currentPage, entriesPerPage],
    queryFn: async () => {
     const id=(user?.id)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: entriesPerPage.toString(),
        type: activeTab !== "all" ? activeTab : "",
      });
      const res = await api.get(`/transaction/user/${id}`);
      return res.data.data;
    },
  });
console.log(walletData)
  const handlePayment = async () => {
    // if (!user?.studentProfile?.id) {
    //   alert("User not found. Please login again.");
    //   return;
    // }

    if (!loadAmount || parseFloat(loadAmount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      setIsLoading(true);
      const studentId = user?.id || 2;

      const amount = parseFloat(loadAmount);
      const payload = {
        amount,
        studentId,
        email: user?.email || "",
        name: user?.name || "Student Name",
        phone: user?.phoneNumber || "9800000000",
      };
      if (selectedWallet === "khalti") {
        await initiateKhaltiCredit(payload);
      } else {
        // Handle eSewa payment
        // You'll need to implement eSewa integration similar to Khalti
        console.log("eSewa payment not implemented yet");
        alert("eSewa payment will be implemented soon.");
      }


      // Close modal and refresh data
      setShowLoadModal(false);
      refetch();
      refetchTransactions();
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
      refetch()
    }
  };

  // Get wallet amounts from API data
  const currentBalance = walletData?.currentBalance || 0;
  const totalCredits = walletData?.totalCredits || 0;
  const totalDebits = walletData?.totalDebits || 0;

  // Get transactions from API data
  const transactions = transactionsData|| [];
  const totalTransactions = transactionsData?.total || 0;
  const creditedCount = transactionsData?.creditedCount || 0;
  const debitedCount = transactionsData?.debitedCount || 0;

  // Calculate pagination
  const totalPages = Math.ceil(totalTransactions / entriesPerPage);
  const startEntry = (currentPage - 1) * entriesPerPage + 1;
  const endEntry = Math.min(currentPage * entriesPerPage, totalTransactions);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getTransactionIcon = (type, gateway) => {
    if (gateway?.toLowerCase().includes("esewa")) {
      return <span className="text-teal-600 font-bold text-sm">E</span>;
    } else if (gateway?.toLowerCase().includes("khalti")) {
      return <span className="text-purple-600 font-bold text-sm">K</span>;
    }
    return <span className="text-gray-600 font-bold text-sm">$</span>;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Wallet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Student Wallet Amount */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm font-medium opacity-90">TutorMe</h3>
              <p className="text-xs opacity-75">Student's Wallet Amount</p>
            </div>
            <Eye className="w-5 h-5 opacity-75" />
          </div>
          <div className="mb-4">
            <h2 className="text-2xl font-bold">
              {walletLoading
                ? "Loading..."
                : `Rs. ${walletData.coin.toLocaleString()}`}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLoadModal(true)}
              className="text-xs bg-black bg-opacity-20 px-3 py-1 rounded-md hover:bg-opacity-30 transition-colors"
            >
              Load Wallet
            </button>
          </div>
        </div>

        {/* Total Credits */}
        <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">TutorMe</h3>
              <p className="text-xs text-gray-600">Total Credits</p>
            </div>
            <Eye className="w-5 h-5 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {walletLoading
              ? "Loading..."
              : `Rs. ${totalCredits.toLocaleString()}`}
          </h2>
        </div>

        {/* Total Debits */}
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">TutorMe</h3>
              <p className="text-xs text-gray-600">Total Debits</p>
            </div>
            <Eye className="w-5 h-5 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {walletLoading
              ? "Loading..."
              : `Rs. ${totalDebits.toLocaleString()}`}
          </h2>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Show</span>
              <div className="relative">
                <select
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                  className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 pr-8 text-sm focus:outline-none focus:border-teal-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
              <span className="text-sm text-gray-600">entries</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by</span>
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 pr-8 text-sm focus:outline-none focus:border-teal-500">
                  <option>Date</option>
                  <option>Amount</option>
                  <option>Status</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "all"
                  ? "text-gray-700 border-b-2 border-gray-300"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All Transaction ({totalTransactions})
            </button>
            <button
              onClick={() => setActiveTab("credited")}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "credited"
                  ? "text-teal-600 border-b-2 border-teal-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Credited ({creditedCount})
            </button>
            <button
              onClick={() => setActiveTab("debited")}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "debited"
                  ? "text-gray-700 border-b-2 border-gray-300"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Debited ({debitedCount})
            </button>
          </div>
        </div>

        {/* Transaction List */}
        <div className="divide-y divide-gray-100">
          {transactionsLoading ? (
            <div className="p-8 text-center text-gray-500">
              Loading transactions...
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No transactions found
            </div>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    {getTransactionIcon(transaction.type, transaction.gateway)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {transaction.type} Rs.{" "}
                      {transaction.amount?.toLocaleString()} from{" "}
                      {transaction.gateway || "System"}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {transaction.type} on {formatDate(transaction.createdAt)}
                    </p>
                    <span
                      className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded ${
                        transaction.status === "completed" ||
                        transaction.status === "credited"
                          ? "bg-teal-100 text-teal-700"
                          : transaction.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    Balance Amount: Rs.{" "}
                    {transaction.balanceAfter?.toLocaleString() || "N/A"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {startEntry} to {endEntry} of {totalTransactions} entries
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
              const pageNum =
                Math.max(1, Math.min(totalPages - 2, currentPage - 1)) + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 text-sm rounded ${
                    currentPage === pageNum
                      ? "bg-teal-500 text-white"
                      : "text-gray-600 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Load Balance Modal */}
      {showLoadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Load Balance
              </h2>
              <button
                onClick={() => setShowLoadModal(false)}
                className="text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Enter Balance to Load
              </label>
              <input
                type="number"
                value={loadAmount}
                onChange={(e) => setLoadAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 text-lg"
                placeholder="2000"
                min="100"
                max="50000"
                disabled={isLoading}
              />
            </div>

            <div className="mb-6">
              <div className="flex gap-2 flex-wrap">
                {[200, 500, 1000, 2000, 5000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setLoadAmount(amount.toString())}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors disabled:opacity-50 ${
                      loadAmount === amount.toString()
                        ? "border-teal-500 text-teal-600 bg-teal-50"
                        : "border-teal-200 text-teal-600 hover:border-teal-300 hover:bg-teal-50"
                    }`}
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Choose wallet to load from
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedWallet("esewa")}
                  disabled={isLoading}
                  className={`flex items-center justify-center w-20 h-20 rounded-xl border-2 transition-all disabled:opacity-50 ${
                    selectedWallet === "esewa"
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">e</span>
                  </div>
                </button>
                <button
                  onClick={() => setSelectedWallet("khalti")}
                  disabled={isLoading}
                  className={`flex items-center justify-center w-20 h-20 rounded-xl border-2 transition-all disabled:opacity-50 ${
                    selectedWallet === "khalti"
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-red-600 font-bold text-lg">khalti</div>
                </button>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLoadModal(false)}
                disabled={isLoading}
                className="px-6 py-3 text-teal-600 border-2 border-teal-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={
                  isLoading || !loadAmount || parseFloat(loadAmount) <= 0
                }
                className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Processing..." : "Load Balance"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
