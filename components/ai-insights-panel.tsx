"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, AlertTriangle, Info } from "lucide-react"
import type { AIInsight } from "@/lib/ai-services"

interface AIInsightsPanelProps {
  insights: AIInsight[]
}

export function AIInsightsPanel({ insights }: AIInsightsPanelProps) {
  const getIcon = (type: AIInsight["type"]) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "reminder":
        return <Info className="h-4 w-4 text-primary" />
      case "prediction":
        return <Brain className="h-4 w-4 text-purple-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.length > 0 ? (
          insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              {getIcon(insight.type)}
              <div className="flex-1">
                <p className="text-sm leading-relaxed">{insight.message}</p>
              </div>
              <Badge
                variant={
                  insight.priority === "high" ? "destructive" : insight.priority === "medium" ? "default" : "secondary"
                }
              >
                {insight.priority}
              </Badge>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No insights available at the moment.</p>
        )}
      </CardContent>
    </Card>
  )
}
