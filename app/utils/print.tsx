import api from "@/lib/axios";
import { PrinterConfig, PrinterSettings } from "@/types";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

const print = (reff: string[]) => {
  const printerSettings = localStorage.getItem('printerSettings')
  const printSett: PrinterSettings = printerSettings ? JSON.parse(printerSettings) : {
    auto: false,
    type: 'pdf',
    config: {
      spaceMatrix: 0,
      space: 1,
      paper: 4,
      font: 12
    }
  }

  if (printSett.type === 'pdf' && printSett.config) {
    printPdf(reff, printSett.config)
  } else if (printSett.type === 'inkjet' && printSett.config) {
    printInkJet(reff, printSett.config)
  } else if(printSett.type === 'dotmatrix' && printSett.config) {
    printDotMatrix(reff, printSett.config)
  }
}

const printDotMatrix = async (reff: string[], config: PrinterConfig) => {
  const reffstring = reff.join('_')
  const srcRegExp = /src="([^"]+)"/
  try {
    const response = await api.post('https://api.billerpay.id/matrix/PrintReceipt.php', {
      id: reffstring,
      spasi: config.spaceMatrix,
      versi: 'V1'
    });
    const resWCPP = response.data.toString()
    const match = resWCPP.match(srcRegExp)
    if(match) {
      console.log(match[1])
    }
    // const fileURL = URL.createObjectURL(response.data);
    // window.open(`webclientprint:https://api.billerpay.id:443/matrix/PrintReceipts.php?id=${reffstring}&clientPrint&useDefaultPrinter=checked&printerName=undefined&spasi=${config.spaceMatrix}`);
  } catch (error) {
    const err = error as AxiosError
    if(err.status && err.status >= 500) {
      toast.error('Terjadi kesalahan sistem')
    }
  }
}

const printPdf = async (reff: string[], config: PrinterConfig) => {
  const reffstring = reff.join('_')
  try {
    const response = await api.post(`https://api.billerpay.id/ink/index.php?id=${reffstring}`, {
      struk: config.paper,
      spasi: config.space,
      fontsize: config.font,
      versi: 'V1'
    }, {
      responseType: "blob",
    });

    const fileURL = URL.createObjectURL(response.data);
    window.open(fileURL);
  } catch (error) {
    const err = error as AxiosError
    if(err.status && err.status >= 500) {
      toast.error('Terjadi kesalahan sistem')
    }
  }
}

const printInkJet = async (reff: string[], config: PrinterConfig) => {
  const reffstring = reff.join('_')
  try {
    const response = await api.post(`https://api.billerpay.id/ink/index.php?id=${reffstring}`, {
      struk: config.paper,
      spasi: config.space,
      fontsize: config.font,
      versi: 'V1'
    }, {
      responseType: "blob",
    });

    const fileURL = URL.createObjectURL(response.data)
    const newTab = window.open(fileURL)

    if (newTab) {
      newTab.onload = () => {
        newTab.print() // Automatically trigger print
      }
    }
  } catch (error) {
    const err = error as AxiosError
    if(err.status && err.status >= 500) {
      toast.error('Terjadi kesalahan sistem')
    }
  }
}

export { print }