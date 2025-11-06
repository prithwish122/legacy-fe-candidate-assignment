"use client"
import Navbar from "@/components/navbar"
import MessageSigner from "@/components/message-signer"
import HistoryList from "@/components/message-signer/history-list"
// import DashboardCards from "@/components/dashboard-cards"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/background.png')" }}>
      <Navbar />

      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 items-start py-12">
            {/* Left Column - Message Signer */}
            <div className="flex flex-col justify-center">
              <MessageSigner />
            </div>

            {/* Right Column - Recent Signatures */}
            <div className="flex flex-col gap-6">
            <h2 className="text-white text-2xl lg:text-3xl font-bold">Recent signatures</h2>
            <HistoryList />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


