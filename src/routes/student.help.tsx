import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { HelpCircle, ChevronDown, ChevronUp, MessageSquare, Phone, Book } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/student/help')({
  component: StudentHelpPage,
})

function StudentHelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const faqs = [
    {
      q: 'How does ARGUS adaptive verification work?',
      a: 'Unlike traditional facial recognition that simply matches a face, ARGUS assesses multiple contextual risk factors (known device, room location, image clarity, and liveness). If you are using your registered laptop in your usual classroom, verification is instant. If you use a friend’s phone or have poor lighting, ARGUS adapts by requesting a quick gesture challenge or teacher visual review rather than marking you absent.',
    },
    {
      q: 'What should I do if verification is marked "Under Review"?',
      a: 'Don’t panic! Under Review simply means one of the signals (such as face similarity or device trust) was borderline. Your attempt has been sent to your course instructor’s live dashboard. You remain marked as a pending attendee while the instructor verifies you visually.',
    },
    {
      q: 'Why did my camera verification fail for poor lighting?',
      a: 'ARGUS enforces image quality checks to prevent false match errors. Ensure your face is evenly illuminated and avoid sitting with strong backlight (such as an open window directly behind your head).',
    },
    {
      q: 'How do I register a new smartphone or laptop?',
      a: 'Simply log in to ARGUS on the new device and mark attendance. The first attempt from a new hardware device will be categorized as "Unknown Device" and may trigger a secondary gesture challenge. After successful completion and instructor acknowledgment, the device trust score automatically rises.',
    },
    {
      q: 'What is the attendance shortage threshold?',
      a: 'The university statutory requirement is 75.0% aggregate attendance across all registered courses. Any student below 75% will receive automated warnings and may be debarred from writing semester examinations unless an authorized medical appeal is approved.',
    },
  ]

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
          <HelpCircle className="w-6 h-6 text-emerald-400" />
          <span>Student Help Center & Verification Troubleshooting</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Frequently asked questions, system guidelines, and technical support escalation
        </p>
      </div>

      {/* FAQs */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openFaq === idx
          return (
            <Card
              key={idx}
              onClick={() => setOpenFaq(isOpen ? null : idx)}
              className="p-4 bg-slate-900/80 border-slate-800 hover:border-slate-700 cursor-pointer transition-all space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </div>
              {isOpen && <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800">{faq.a}</p>}
            </Card>
          )
        })}
      </div>

      {/* Contact Escalation */}
      <Card className="p-5 bg-slate-900/40 border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-white">Need Technical Assistance on Campus?</h4>
          <p className="text-xs text-slate-400">
            Contact Academic Computing Helpdesk • North Block Level 2 (Hours: 9 AM - 5 PM)
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => alert('Support ticket raised. Ticket #IT-8841')}>
          <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
          <span>Raise Support Ticket</span>
        </Button>
      </Card>
    </div>
  )
}
