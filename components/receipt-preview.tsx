"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Download, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface ReceiptData {
  receiptNo: string
  date: string
  studentName: string
  rollNo: string
  className: string
  items: { name: string; amount: number }[]
  total: number
  paymentMethod: string
}

export function ReceiptPreview({ data }: { data: ReceiptData }) {
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-xl bg-card overflow-hidden max-w-lg mx-auto relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <CheckCircle2 className="w-24 h-24 text-accent" />
        </div>

        <CardContent className="p-8 pt-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-1">Fee Receipt</h2>
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">#{data.receiptNo}</p>
            </div>
            <Badge variant="default" className="bg-accent/10 text-accent border-none font-bold">
              PAID
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Student Details</p>
              <p className="font-bold">{data.studentName}</p>
              <p className="text-xs text-muted-foreground">
                {data.className} • Roll {data.rollNo}
              </p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground mb-1">Payment Date</p>
              <p className="font-bold">{data.date}</p>
              <p className="text-xs text-muted-foreground">Via {data.paymentMethod}</p>
            </div>
          </div>

          <Separator className="mb-6 opacity-50" />

          <div className="space-y-4 mb-8">
            {data.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{item.name}</span>
                <span className="font-medium">₹{item.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="bg-muted/50 rounded-2xl p-6 flex justify-between items-center mb-6">
            <span className="font-bold text-lg">Total Amount</span>
            <span className="font-black text-2xl text-accent">₹{data.total.toLocaleString()}</span>
          </div>

          <div className="text-[10px] text-center text-muted-foreground uppercase tracking-[0.2em] font-medium italic">
            This is a computer-generated receipt and requires no signature.
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-center">
        <Button variant="outline" className="rounded-full px-6 gap-2 bg-transparent">
          <Printer className="w-4 h-4" />
          Print Receipt
        </Button>
        <Button className="rounded-full px-8 gap-2 shadow-lg shadow-accent/20">
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
      </div>
    </div>
  )
}
