import PDFDocument from "pdfkit"
import { VehicleEntity } from "@contexts/vehicle/domain/entities/vehicle"
import { BadRequestException } from "@lib/erros"

export class PdfService {
  async generateVehicleReport(vehicle: VehicleEntity): Promise<Buffer> {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50,
        },
      })

      const buffers: Buffer[] = []

      doc.on("data", (chunk) => buffers.push(chunk))

      const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
        doc.on("end", () => {
          resolve(Buffer.concat(buffers))
        })

        doc.on("error", (error) => {
          reject(error)
        })

        this.generatePdfContent(doc, vehicle)

        doc.end()
      })

      return pdfBuffer
    } catch (error) {
      throw new BadRequestException(
        "Erro ao gerar PDF: " +
          (error instanceof Error ? error.message : "Erro desconhecido")
      )
    }
  }

  private generatePdfContent(
    doc: InstanceType<typeof PDFDocument>,
    vehicle: VehicleEntity
  ): void {
    const titleFontSize = 24
    const headerFontSize = 16
    const normalFontSize = 12
    const smallFontSize = 10

    const primaryColor = "#2c3e50"
    const secondaryColor = "#34495e"
    const accentColor = "#3498db"

    this.createCoverPage(
      doc,
      vehicle,
      titleFontSize,
      headerFontSize,
      normalFontSize,
      primaryColor,
      secondaryColor
    )

    doc.addPage()

    doc.fontSize(headerFontSize).fillColor(primaryColor).text("Dados do Veículo")

    doc.moveDown(1)

    const vehicleData = [
      ["Placa", vehicle.veiculo.placa],
      ["Marca", vehicle.veiculo.marca],
      ["Modelo", vehicle.veiculo.modelo],
      ["Ano", vehicle.veiculo.ano.toString()],
    ]

    this.drawTable(doc, vehicleData, normalFontSize, primaryColor)

    doc.moveDown(2)

    // Tabala de dados do proprietário (nao ta na doc do test, ver se compensa manter)
    // doc.fontSize(headerFontSize).fillColor(primaryColor).text("Dados do Proprietário")

    // doc.moveDown(1)

    // const ownerData = [
    //   ["Nome", vehicle.proprietario.nome],
    //   ["Documento", vehicle.proprietario.documento],
    //   ["Endereço", vehicle.proprietario.endereco],
    // ]

    // this.drawTable(doc, ownerData, normalFontSize, primaryColor)

    // doc.moveDown(2)

    doc.fontSize(headerFontSize).fillColor(primaryColor).text("Histórico de Manutenção")

    doc.moveDown(1)

    if (vehicle.historicoManutencao.length === 0) {
      doc
        .fontSize(normalFontSize)
        .fillColor(secondaryColor)
        .text("Nenhum registro de manutenção encontrado.")
    } else {
      const maintenanceHeaders = ["Data", "Serviço", "Quilometragem", "Custo"]
      const maintenanceData = vehicle.historicoManutencao.map((record) => [
        this.formatDate(record.data),
        record.servico,
        record.quilometragem.toLocaleString("pt-BR") + " km",
        "R$ " + record.custo.toFixed(2).replace(".", ","),
      ])

      this.drawMaintenanceTable(
        doc,
        maintenanceHeaders,
        maintenanceData,
        normalFontSize,
        primaryColor
      )

      doc.moveDown(1)

      // !!! pequeno overwiew de manutenções (ver se compensa menter ou se devo seguir a risca a doc do test)
      // doc
      //   .fontSize(normalFontSize)
      //   .fillColor(secondaryColor)
      //   .text(`Total de manutenções: ${vehicle.getMaintenanceCount()}`)

      // doc.text(
      //   `Custo total: R$ ${vehicle
      //     .getTotalMaintenanceCost()
      //     .toFixed(2)
      //     .replace(".", ",")}`
      // )

      // const lastMaintenance = vehicle.getLastMaintenanceDate()
      // if (lastMaintenance) {
      //   doc.text(`Última manutenção: ${this.formatDate(lastMaintenance)}`)
      // }
    }
  }

  // Funcao responsavel por criar a tabela de dados do pdf
  private drawTable(
    doc: InstanceType<typeof PDFDocument>,
    data: string[][],
    fontSize: number,
    color: string
  ): void {
    const startY = doc.y
    const colWidth = (doc.page.width - 100) / 2
    const baseRowHeight = 25
    let currentY = startY

    data.forEach((row, index) => {
      const leftTextHeight = this.calculateTextHeight(
        doc,
        row[0],
        colWidth - 20,
        fontSize
      )
      const rightTextHeight = this.calculateTextHeight(
        doc,
        row[1],
        colWidth - 20,
        fontSize
      )
      const rowHeight = Math.max(leftTextHeight, rightTextHeight, baseRowHeight)

      if (index % 2 === 0) {
        doc
          .rect(50, currentY, doc.page.width - 100, rowHeight)
          .fillColor("#f8f9fa")
          .fill()
      }

      doc
        .fillColor(color)
        .fontSize(fontSize)
        .text(row[0], 60, currentY + 8, { width: colWidth - 20 })
        .text(row[1], 60 + colWidth, currentY + 8, { width: colWidth - 20 })

      doc
        .strokeColor("#dee2e6")
        .lineWidth(0.5)
        .moveTo(50, currentY + rowHeight)
        .lineTo(doc.page.width - 50, currentY + rowHeight)
        .stroke()

      currentY += rowHeight
    })

    doc.x = 50
    doc.y = currentY + 10
  }

  // Funcao responsavel por criar a tabela de manutenções do pdf
  private drawMaintenanceTable(
    doc: InstanceType<typeof PDFDocument>,
    headers: string[],
    data: string[][],
    fontSize: number,
    color: string
  ): void {
    const startY = doc.y
    const colWidths = [80, 200, 100, 80]
    const baseRowHeight = 25
    const totalWidth = colWidths.reduce((sum, width) => sum + width, 0)
    let currentY = startY

    const headerHeight = Math.max(
      ...headers.map((header, index) =>
        this.calculateTextHeight(doc, header, colWidths[index] - 10, fontSize)
      ),
      baseRowHeight
    )

    doc.fillColor("#000").rect(50, currentY, totalWidth, headerHeight).fill()

    let x = 50
    headers.forEach((header, index) => {
      doc
        .fillColor("white")
        .fontSize(fontSize)
        .text(header, x + 5, currentY + 8, { width: colWidths[index] - 10 })
      x += colWidths[index]
    })

    currentY += headerHeight

    data.forEach((row, rowIndex) => {
      const rowHeight = Math.max(
        ...row.map((cell, colIndex) =>
          this.calculateTextHeight(doc, cell, colWidths[colIndex] - 10, fontSize)
        ),
        baseRowHeight
      )

      if (rowIndex % 2 === 0) {
        doc.fillColor("#f8f9fa").rect(50, currentY, totalWidth, rowHeight).fill()
      }

      x = 50
      row.forEach((cell, colIndex) => {
        doc
          .fillColor(color)
          .fontSize(fontSize)
          .text(cell, x + 5, currentY + 8, { width: colWidths[colIndex] - 10 })
        x += colWidths[colIndex]
      })

      doc
        .strokeColor("#dee2e6")
        .lineWidth(0.5)
        .moveTo(50, currentY + rowHeight)
        .lineTo(50 + totalWidth, currentY + rowHeight)
        .stroke()

      currentY += rowHeight
    })

    doc.x = 50
    doc.y = currentY + 10
  }

  // Funcao responsavel por criar a pagina de capa do pdf
  private createCoverPage(
    doc: InstanceType<typeof PDFDocument>,
    vehicle: VehicleEntity,
    titleFontSize: number,
    headerFontSize: number,
    normalFontSize: number,
    primaryColor: string,
    secondaryColor: string
  ): void {
    doc.x = 50
    doc.y = 50

    const pageHeight = doc.page.height
    const centerY = pageHeight / 2 - 150

    doc.y = centerY

    doc
      .fontSize(titleFontSize + 8)
      .fillColor(primaryColor)
      .text("Relatório de Veículo", { align: "center" })

    doc.moveDown(3)

    doc
      .fontSize(headerFontSize + 4)
      .fillColor(secondaryColor)
      .text(`Placa: ${vehicle.veiculo.placa}`, { align: "center" })

    doc.moveDown(2)

    doc
      .fontSize(normalFontSize + 2)
      .fillColor(primaryColor)
      .text(`Proprietário: ${vehicle.proprietario.nome}`, { align: "center" })

    // doc.y = pageHeight - 100
    // doc
    //   .fontSize(normalFontSize - 2)
    //   .fillColor(secondaryColor)
    //   .text(
    //     `Gerado em: ${new Date().toLocaleDateString(
    //       "pt-BR"
    //     )} às ${new Date().toLocaleTimeString("pt-BR")}`,
    //     { align: "center" }
    //   )
  }

  private calculateTextHeight(
    doc: InstanceType<typeof PDFDocument>,
    text: string,
    width: number,
    fontSize: number
  ): number {
    doc.fontSize(fontSize)

    const lines = doc.heightOfString(text, { width })

    return lines + 16
  }

  private formatDate(dateString: string): string {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("pt-BR")
    } catch {
      return dateString
    }
  }
}
