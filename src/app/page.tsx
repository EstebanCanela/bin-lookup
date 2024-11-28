"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  Loader2,
  CreditCard,
  Building,
  Globe,
  Copy,
  CheckCircle2,
  Code,
  GlobeLock,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BinLookUpResponse, getBinUseCase } from "@/lib/getBin.usecase";

export default function Home() {
  const [bin, setBin] = useState("");
  const [binData, setBinData] = useState<BinLookUpResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setBinData(null);

    if (bin.length < 6 || bin.length > 8 || !/^\d+$/.test(bin)) {
      setError("Please enter a valid 6/8-digit BIN");
      setLoading(false);
      return;
    }

    try {
      const data = await getBinUseCase(Number(bin));
      if (data) {
        setBinData(data);
      } else {
        setError("BIN is not found. Please check the input and try again.");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("An error occurred while fetching BIN data");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>BIN Lookup</CardTitle>
        <CardDescription>
          Enter the first 6/8 digits of a credit card number to get information
          about the issuing institution and card type.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <AlertTitle>What is a BIN?</AlertTitle>
          <AlertDescription>
            A Bank Identification Number (BIN) is the first 6/8 digits of a
            credit card number. It identifies the institution that issued the
            card. BINs are used to:
            <ul className="list-disc list-inside mt-2">
              <li>Identify the card brand (Visa, Mastercard, etc.)</li>
              <li>Determine the issuing bank</li>
              <li>Verify the card&apos;s validity</li>
            </ul>
            <p className="mt-2">
              <strong>Luhn Algorithm:</strong> Most credit card numbers are
              validated using the Luhn algorithm, a checksum formula used to
              verify various identification numbers.
            </p>
          </AlertDescription>
        </Alert>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-2">
            <Input
              type="number"
              value={bin}
              onChange={(e) => setBin(e.target.value)}
              placeholder="Enter 6/8-digit BIN"
              minLength={6}
              maxLength={8}
              min={0}
              className="flex-grow"
            />
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Lookup"
              )}
            </Button>
          </div>
          {error && (
            <div className="text-red-500 flex items-center">
              <AlertCircle className="mr-2 h-4 w-4" />
              {error}
            </div>
          )}
          {binData && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">BIN Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow className="border-b">
                      <TableCell className="font-medium flex items-center">
                        <GlobeLock className="mr-2 h-4 w-4" />
                        Scheme/Network
                      </TableCell>
                      <TableCell>{binData.scheme || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow className="border-b">
                      <TableCell className="font-medium flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Type
                      </TableCell>
                      <TableCell>{binData.type || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow className="border-b">
                      <TableCell className="font-medium flex items-center">
                        <Building className="mr-2 h-4 w-4" />
                        Issuer
                      </TableCell>
                      <TableCell>{binData.issuer || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow className="border-b">
                      <TableCell className="font-medium flex items-center">
                        <Globe className="mr-2 h-4 w-4" />
                        Country
                      </TableCell>
                      <TableCell>
                        {binData.country?.iso_country || "N/A"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium flex items-center">
                        <Code className="mr-2 h-4 w-4" />
                        Luhn
                      </TableCell>
                      <TableCell>{binData.luhn ? "Yes" : "N/A"}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </form>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">API Usage Example</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">
              Here&apos;s how you can use our API to fetch BIN information:
            </p>
            <Tabs defaultValue="curl" className="w-full">
              <TabsList>
                <TabsTrigger value="curl">cURL</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
              </TabsList>
              <TabsContent value="curl">
                <div className="bg-secondary p-4 rounded-md relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      copyToClipboard(
                        'curl -X GET "https://bin.efcanela.com/api/:bin"'
                      )
                    }
                  >
                    {copied ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <pre className="whitespace-pre-wrap break-all text-sm">
                    <code>
                      curl -X GET &quot;https://bin.efcanela.com/api/:bin&quot;
                    </code>
                  </pre>
                </div>
              </TabsContent>
              <TabsContent value="javascript">
                <div className="bg-secondary p-4 rounded-md relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      copyToClipboard(`fetch('https://bin.efcanela.com/api/:bin')
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`)
                    }
                  >
                    {copied ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <pre className="whitespace-pre-wrap break-all text-sm">
                    <code>
                      {`fetch('https://bin.efcanela.com/api/:bin')
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`}
                    </code>
                  </pre>
                </div>
              </TabsContent>
              <TabsContent value="python">
                <div className="bg-secondary p-4 rounded-md relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      copyToClipboard(`import requests

url = "https://bin.efcanela.com/api/:bin"

response = requests.get(url)
data = response.json()
print(data)`)
                    }
                  >
                    {copied ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <pre className="whitespace-pre-wrap break-all text-sm">
                    <code>
                      {`import requests

url = "https://bin.efcanela.com/api/:bin"

response = requests.get(url)
data = response.json()
print(data)`}
                    </code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
            <p className="mt-2 text-sm text-muted-foreground">
              Replace &quot;:bin&quot; with the BIN you want to look up.
            </p>
            <Alert variant="default" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>API Usage Disclaimer</AlertTitle>
              <AlertDescription>
                While this API is free to use, please be mindful of your request
                frequency. The service is protected by firewalls and rate
                limiters. Excessive requests may result in temporary blocks. Use
                responsibly and consider implementing caching in your
                applications.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          Made with ❤️{" "}
          <a href="mailto:estebancanela@gmail.com?subject=BIN Lookup">
            by Esteban Canela
          </a>
        </footer>
      </CardContent>
    </div>
  );
}
