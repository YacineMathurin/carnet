// components/DownloadPrescriptionButton.tsx
'use client'
import React from 'react'
import { useFormFields } from '@payloadcms/ui'
import { jsPDF } from 'jspdf'

// 1. FIX: Redefine the type for a generic FieldState to avoid the missing export error (ts(2305)).
// This mimics the FieldState structure for the properties you are accessing.
type FieldValue = string | number | boolean | null | undefined
type GenericFieldState = {
  value: FieldValue
  // The full FieldState includes more, but this is enough for your usage:
  // errorMessage?: string
  // initialValue?: FieldValue
  // ...
}

// 2. FIX: Define Medication type separately for clarity
interface Medication {
  nomMedicament?: string
  dosage?: string
  frequence?: string
  duree?: string
  instructions?: string
}

interface TraitementItem {
  datePrescription?: string
  medecin?: string
  diagnostic?: string
  medicaments?: Medication[]
  notesSupplementaires?: string
}

// Map of all fields you access
interface FormFields {
  path?: GenericFieldState // path field
  traitements?: {
    value?: TraitementItem[]
  } & GenericFieldState
  patientId?: GenericFieldState
  nom?: GenericFieldState
  prenom?: GenericFieldState
  poids?: GenericFieldState
  taille?: GenericFieldState
  imc?: GenericFieldState
}

export const DownloadPrescriptionButton: React.FC = () => {
  // Use a type assertion to apply the defined FormFields structure
  const fields = useFormFields(([fields]) => fields) as FormFields

  const handleDownloadPDF = () => {
    try {
      // 1. Safely access the 'path' and get the traitementIndex
      const pathValue = fields.path?.value

      if (typeof pathValue !== 'string') {
        alert(
          "Erreur: Le chemin du formulaire ('path') n'est pas disponible ou n'est pas une chaîne de caractères.",
        )
        return
      }

      const pathParts = pathValue.split('.')
      const traitementsIndex = pathParts.indexOf('traitements')

      if (traitementsIndex === -1 || traitementsIndex + 1 >= pathParts.length) {
        alert("Erreur: Impossible de déterminer l'index du traitement à partir du chemin.")
        return
      }

      const traitementIndex = pathParts[traitementsIndex + 1]

      // 2. Access the traitement data safely
      const traitementsArray = fields.traitements?.value

      // Ensure the array exists and has the item at the specific index
      if (
        !traitementsArray ||
        !Array.isArray(traitementsArray) ||
        !traitementsArray[Number(traitementIndex)]
      ) {
        alert('Aucune donnée de traitement disponible pour cet index.')
        return
      }

      // Cast the accessed item to the defined interface
      const traitementData: TraitementItem = traitementsArray[Number(traitementIndex)]

      // 3. Get patient info (Access the 'value' property and provide a default)
      // We must cast `value` to a string before using `String()` since it could be a number, null, etc.
      const patientId = String(fields.patientId?.value || 'N/A')
      const nom = String(fields.nom?.value || '')
      const prenom = String(fields.prenom?.value || '')
      const poids = String(fields.poids?.value || 'N/A')
      const taille = String(fields.taille?.value || 'N/A')
      const imc = String(fields.imc?.value || 'N/A')

      // Create PDF
      const doc = new jsPDF()

      // Header
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.text('ORDONNANCE MÉDICALE', 105, 20, { align: 'center' })
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text('_'.repeat(80), 20, 25)

      // Patient Info
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('INFORMATIONS PATIENT', 20, 35)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`ID Patient: ${patientId}`, 20, 45)
      doc.text(`Nom: ${nom} ${prenom}`, 20, 52)
      doc.text(`Poids: ${poids} kg | Taille: ${taille} cm | IMC: ${imc}`, 20, 59)

      // Prescription Info setup...
      let yPos = 75
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('PRESCRIPTION', 20, yPos)
      yPos += 10
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')

      if (traitementData.datePrescription) {
        const date = new Date(traitementData.datePrescription)
        const formatted = date.toLocaleDateString('fr-FR')
        doc.text(`Date: ${formatted}`, 20, yPos)
        yPos += 7
      }
      if (traitementData.medecin) {
        doc.text(`Médecin: Dr. ${traitementData.medecin}`, 20, yPos)
        yPos += 7
      }
      if (traitementData.diagnostic) {
        yPos += 3
        doc.setFont('helvetica', 'bold')
        doc.text('Diagnostic:', 20, yPos)
        yPos += 7
        doc.setFont('helvetica', 'normal')
        const diagnosticLines = doc.splitTextToSize(traitementData.diagnostic, 170)
        doc.text(diagnosticLines, 20, yPos)
        yPos += diagnosticLines.length * 7 + 5
      }

      // Medications
      if (traitementData.medicaments && traitementData.medicaments.length > 0) {
        yPos += 5
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('MÉDICAMENTS PRESCRITS', 20, yPos)
        yPos += 10

        doc.setFontSize(10)

        // 3. FIX: Use the Medication type directly
        traitementData.medicaments.forEach((med: Medication, index: number) => {
          // Check if we need a new page
          if (yPos > 250) {
            doc.addPage()
            yPos = 20
          }

          doc.setFont('helvetica', 'bold')
          doc.text(`${index + 1}. ${med.nomMedicament || 'Médicament non spécifié'}`, 25, yPos)
          yPos += 7

          doc.setFont('helvetica', 'normal')
          if (med.dosage) {
            doc.text(`   Dosage: ${med.dosage}`, 25, yPos)
            yPos += 7
          }
          if (med.frequence) {
            doc.text(`   Fréquence: ${med.frequence}`, 25, yPos)
            yPos += 7
          }
          if (med.duree) {
            doc.text(`   Durée: ${med.duree}`, 25, yPos)
            yPos += 7
          }
          if (med.instructions) {
            const instructionLines = doc.splitTextToSize(med.instructions, 160)
            doc.text(`   Instructions:`, 25, yPos)
            doc.text(instructionLines, 25, yPos + 7)
            yPos += instructionLines.length * 7 + 7
          }
          yPos += 5
        })
      }

      // Additional notes
      if (traitementData.notesSupplementaires) {
        if (yPos > 230) {
          doc.addPage()
          yPos = 20
        }
        yPos += 5
        doc.setFont('helvetica', 'bold')
        doc.text('Notes supplémentaires:', 20, yPos)
        yPos += 7
        doc.setFont('helvetica', 'normal')
        const notesLines = doc.splitTextToSize(traitementData.notesSupplementaires, 170)
        doc.text(notesLines, 20, yPos)
        yPos += notesLines.length * 7
      }

      // Footer
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'italic')
        doc.text(
          `Page ${i} sur ${pageCount} | Document généré le ${new Date().toLocaleDateString('fr-FR')}`,
          105,
          285,
          { align: 'center' },
        )
      }

      // Generate filename and download
      const filename = `Prescription_${nom}_${prenom}_${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(filename)
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error)
      alert('Erreur lors de la génération du PDF')
    }
  }

  return (
    <div style={{ marginTop: '20px', marginBottom: '20px' }}>
      <button
        type="button"
        onClick={handleDownloadPDF}
        style={{
          backgroundColor: '#0070f3',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#0051cc'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#0070f3'
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Télécharger la prescription (PDF)
      </button>
    </div>
  )
}

export default DownloadPrescriptionButton
