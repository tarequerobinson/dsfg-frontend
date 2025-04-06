"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function TermsAndConditionsPage() {
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [eulaAgreed, setEulaAgreed] = useState(false)
  const [showError, setShowError] = useState(false)
  const router = useRouter()

  const handleContinue = () => {
    if (termsAgreed && eulaAgreed) {
      // Redirect to signup page when both terms are agreed
      router.push("/signup")
    } else {
      setShowError(true)
    }
  }

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>

      {showError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You must agree to both the Terms and Conditions and the End User License Agreement to continue.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3 font-medium">Terms and Conditions</div>
          <ScrollArea className="h-64 p-4">
            <div className="space-y-4 text-sm">
              <h2 className="text-lg font-semibold">1. Introduction</h2>
              <p>
                Welcome to our service. By accessing or using our website, services, applications, or any content
                provided therein, you agree to be bound by these Terms and Conditions.
              </p>

              <h2 className="text-lg font-semibold">2. Definitions</h2>
              <p>
                "Service" refers to the website, application, and services provided by our company. "User" refers to any
                individual who accesses or uses the Service. "Content" refers to all information, text, graphics,
                photos, or other materials uploaded, downloaded, or appearing on the Service.
              </p>

              <h2 className="text-lg font-semibold">3. Account Registration</h2>
              <p>
                To access certain features of the Service, you may be required to register for an account. You agree to
                provide accurate, current, and complete information during the registration process and to update such
                information to keep it accurate, current, and complete.
              </p>

              <h2 className="text-lg font-semibold">4. User Conduct</h2>
              <p>
                You agree not to use the Service for any illegal or unauthorized purpose. You agree to comply with all
                laws, rules, and regulations applicable to your use of the Service.
              </p>

              <h2 className="text-lg font-semibold">5. Intellectual Property</h2>
              <p>
                The Service and its original content, features, and functionality are and will remain the exclusive
                property of our company and its licensors. The Service is protected by copyright, trademark, and other
                laws.
              </p>

              <h2 className="text-lg font-semibold">6. Termination</h2>
              <p>
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice
                or liability, under our sole discretion, for any reason whatsoever and without limitation, including but
                not limited to a breach of the Terms.
              </p>

              <h2 className="text-lg font-semibold">7. Limitation of Liability</h2>
              <p>
                In no event shall our company, nor its directors, employees, partners, agents, suppliers, or affiliates,
                be liable for any indirect, incidental, special, consequential or punitive damages, including without
                limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access
                to or use of or inability to access or use the Service.
              </p>

              <h2 className="text-lg font-semibold">8. Changes</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. It is your
                responsibility to check these Terms periodically for changes.
              </p>

              <h2 className="text-lg font-semibold">9. Contact Us</h2>
              <p>If you have any questions about these Terms, please contact us.</p>
            </div>
          </ScrollArea>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={termsAgreed}
            onCheckedChange={(checked) => {
              setTermsAgreed(checked === true)
              if (checked) setShowError(false)
            }}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I have read and agree to the Terms and Conditions
          </label>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3 font-medium">End User License Agreement (EULA)</div>
          <ScrollArea className="h-64 p-4">
            <div className="space-y-4 text-sm">
              <h2 className="text-lg font-semibold">End User License Agreement</h2>
              <p>
                This End User License Agreement ("EULA") is a legal agreement between you and our company for the
                software product identified above, which includes computer software and may include associated media,
                printed materials, and "online" or electronic documentation ("SOFTWARE PRODUCT").
              </p>

              <h2 className="text-lg font-semibold">1. Grant of License</h2>
              <p>
                Our company grants you the following rights provided that you comply with all terms and conditions of
                this EULA:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Installation and Use: You may install and use the SOFTWARE PRODUCT on your devices.</li>
                <li>Reproduction and Distribution: You may not reproduce or distribute the SOFTWARE PRODUCT.</li>
              </ul>

              <h2 className="text-lg font-semibold">2. Description of Other Rights and Limitations</h2>
              <p>
                Limitations on Reverse Engineering, Decompilation, and Disassembly: You may not reverse engineer,
                decompile, or disassemble the SOFTWARE PRODUCT, except and only to the extent that such activity is
                expressly permitted by applicable law notwithstanding this limitation.
              </p>

              <h2 className="text-lg font-semibold">3. Separation of Components</h2>
              <p>
                The SOFTWARE PRODUCT is licensed as a single product. Its component parts may not be separated for use
                on more than one device.
              </p>

              <h2 className="text-lg font-semibold">4. Software Transfer</h2>
              <p>You may not permanently transfer all of your rights under this EULA.</p>

              <h2 className="text-lg font-semibold">5. Termination</h2>
              <p>
                Without prejudice to any other rights, our company may terminate this EULA if you fail to comply with
                the terms and conditions of this EULA. In such event, you must destroy all copies of the SOFTWARE
                PRODUCT and all of its component parts.
              </p>

              <h2 className="text-lg font-semibold">6. Copyright</h2>
              <p>
                All title and copyrights in and to the SOFTWARE PRODUCT (including but not limited to any images,
                photographs, animations, video, audio, music, text, and "applets" incorporated into the SOFTWARE
                PRODUCT), the accompanying printed materials, and any copies of the SOFTWARE PRODUCT are owned by our
                company or its suppliers. The SOFTWARE PRODUCT is protected by copyright laws and international treaty
                provisions. Therefore, you must treat the SOFTWARE PRODUCT like any other copyrighted material.
              </p>

              <h2 className="text-lg font-semibold">7. Limited Warranty</h2>
              <p>
                Our company warrants that the SOFTWARE PRODUCT will perform substantially in accordance with the
                accompanying written materials for a period of ninety (90) days from the date of receipt.
              </p>

              <h2 className="text-lg font-semibold">8. No Liability for Consequential Damages</h2>
              <p>
                In no event shall our company or its suppliers be liable for any damages whatsoever (including, without
                limitation, damages for loss of business profits, business interruption, loss of business information,
                or any other pecuniary loss) arising out of the use of or inability to use this product, even if our
                company has been advised of the possibility of such damages.
              </p>
            </div>
          </ScrollArea>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="eula"
            checked={eulaAgreed}
            onCheckedChange={(checked) => {
              setEulaAgreed(checked === true)
              if (checked) setShowError(false)
            }}
          />
          <label
            htmlFor="eula"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I have read and agree to the End User License Agreement (EULA)
          </label>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" asChild>
            <Link href="/">Cancel</Link>
          </Button>
          <Button onClick={handleContinue}>Continue to Sign Up</Button>
        </div>
      </div>
    </div>
  )
}

