// patients.ts
import { CollectionConfig } from 'payload'

const Patients: CollectionConfig = {
  slug: 'patients',
  admin: {
    useAsTitle: 'nom',
    defaultColumns: ['patientId', 'nom', 'prenom', 'imc'],
    group: 'Dossiers Médicaux',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Informations Patient',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'patientId',
                  type: 'text',
                  required: true,
                  unique: true,
                  label: 'ID Patient',
                  admin: {
                    width: '33%',
                    description: 'Identifiant unique du patient',
                  },
                },
                {
                  name: 'nom',
                  type: 'text',
                  required: true,
                  label: 'Nom',
                  admin: {
                    width: '33%',
                  },
                },
                {
                  name: 'prenom',
                  type: 'text',
                  required: true,
                  label: 'Prénom',
                  admin: {
                    width: '34%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'poids',
                  type: 'number',
                  required: true,
                  label: 'Poids (kg)',
                  admin: {
                    width: '33%',
                    step: 0.1,
                  },
                },
                {
                  name: 'taille',
                  type: 'number',
                  required: true,
                  label: 'Taille (cm)',
                  admin: {
                    width: '33%',
                    step: 0.1,
                  },
                },
                {
                  name: 'imc',
                  type: 'number',
                  label: 'IMC',
                  admin: {
                    width: '34%',
                    readOnly: true,
                    description: 'Calculé automatiquement',
                  },
                  hooks: {
                    beforeChange: [
                      ({ siblingData }) => {
                        if (siblingData.poids && siblingData.taille) {
                          const tailleM = siblingData.taille / 100
                          return parseFloat((siblingData.poids / (tailleM * tailleM)).toFixed(2))
                        }
                        return null
                      },
                    ],
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'Contact',
                  type: 'number',
                  required: true,
                  label: 'Contact',
                  admin: {
                    width: '33%',
                    step: 0.1,
                  },
                },
                {
                  name: 'ContactUrgence',
                  type: 'number',
                  required: true,
                  label: "Contact d'urgence",
                  admin: {
                    width: '33%',
                    step: 0.1,
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Hospitalisations',
          fields: [
            {
              name: 'hospitalisations',
              type: 'array',
              labels: {
                singular: 'Hospitalisation',
                plural: 'Hospitalisations',
              },
              admin: {
                initCollapsed: true,
                components: {
                  RowLabel: './components/HospitalisationRowLabel',
                },
              },
              fields: [
                {
                  name: 'nomHopital',
                  type: 'text',
                  required: true,
                  label: "Nom de l'hôpital",
                  admin: {
                    description: 'Utilisé comme titre de la section',
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'dateEntree',
                      type: 'date',
                      required: true,
                      label: "Date d'entrée",
                      admin: {
                        width: '50%',
                        date: {
                          pickerAppearance: 'dayOnly',
                          displayFormat: 'dd/MM/yyyy',
                        },
                      },
                    },
                    {
                      name: 'dateSortie',
                      type: 'date',
                      label: 'Date de sortie',
                      admin: {
                        width: '50%',
                        date: {
                          pickerAppearance: 'dayOnly',
                          displayFormat: 'dd/MM/yyyy',
                        },
                      },
                    },
                  ],
                },
                {
                  name: 'joursTraitement',
                  type: 'array',
                  label: 'Jours de traitement',
                  labels: {
                    singular: 'Jour de traitement',
                    plural: 'Jours de traitement',
                  },
                  admin: {
                    initCollapsed: true,
                    components: {
                      RowLabel: './components/JourTraitementRowLabel',
                    },
                  },
                  fields: [
                    {
                      name: 'date',
                      type: 'date',
                      required: true,
                      label: 'Date du jour',
                      admin: {
                        date: {
                          pickerAppearance: 'dayOnly',
                          displayFormat: 'dd/MM/yyyy',
                        },
                      },
                    },
                    {
                      name: 'soins',
                      type: 'array',
                      label: 'Soins effectués',
                      labels: {
                        singular: 'Soin',
                        plural: 'Soins',
                      },
                      admin: {
                        initCollapsed: true,
                        components: {
                          RowLabel: './components/SoinRowLabel',
                        },
                      },
                      fields: [
                        {
                          type: 'row',
                          fields: [
                            {
                              name: 'heureSoin',
                              type: 'text',
                              required: true,
                              label: 'Heure',
                              admin: {
                                width: '25%',
                                placeholder: 'HH:MM',
                              },
                            },
                            {
                              name: 'titre',
                              type: 'text',
                              required: true,
                              label: 'Titre du soin',
                              admin: {
                                width: '75%',
                              },
                            },
                          ],
                        },
                        {
                          name: 'description',
                          type: 'textarea',
                          label: 'Description détaillée',
                          admin: {
                            rows: 3,
                          },
                        },
                        {
                          name: 'note',
                          type: 'textarea',
                          label: 'Notes complémentaires',
                          admin: {
                            rows: 2,
                            placeholder: 'Observations, recommandations...',
                          },
                        },
                        {
                          name: 'agentConnecte',
                          type: 'text',
                          label: 'Agent responsable',
                          admin: {
                            readOnly: true,
                            description: '✓ Rempli automatiquement',
                          },
                          hooks: {
                            beforeChange: [
                              ({ req }) => {
                                if (req.user) {
                                  return req.user.email || 'Agent non identifié'
                                }
                                return 'Système'
                              },
                            ],
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Allergies & Traitements ',
          fields: [
            {
              name: 'allergies',
              type: 'array',
              label: 'Allergies',
              fields: [
                {
                  name: 'nomAllergie',
                  type: 'text',
                  required: true,
                  label: "Nom de l'allergie",
                },
              ],
            },
            {
              name: 'traitements',
              type: 'array',
              labels: {
                singular: 'Traitement',
                plural: 'Traitements',
              },
              admin: {
                initCollapsed: true,
                components: {
                  RowLabel: './components/TraitementRowLabel',
                },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'datePrescription',
                      type: 'date',
                      required: true,
                      label: 'Date de prescription',
                      admin: {
                        width: '50%',
                        date: {
                          pickerAppearance: 'dayOnly',
                          displayFormat: 'dd/MM/yyyy',
                        },
                      },
                    },
                    {
                      name: 'medecin',
                      type: 'text',
                      required: true,
                      label: 'Médecin prescripteur',
                      admin: {
                        width: '50%',
                      },
                    },
                  ],
                },
                {
                  name: 'medicaments',
                  type: 'array',
                  label: 'Médicaments',
                  labels: {
                    singular: 'Médicament',
                    plural: 'Médicaments',
                  },
                  minRows: 1,
                  admin: {
                    initCollapsed: true,
                    components: {
                      RowLabel: './components/MedicamentRowLabel',
                    },
                  },
                  fields: [
                    {
                      name: 'nomMedicament',
                      type: 'text',
                      required: true,
                      label: 'Nom du médicament',
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'dosage',
                          type: 'text',
                          required: true,
                          label: 'Dosage',
                          admin: {
                            width: '33%',
                            placeholder: 'ex: 500mg',
                          },
                        },
                        {
                          name: 'frequence',
                          type: 'text',
                          required: true,
                          label: 'Fréquence',
                          admin: {
                            width: '33%',
                            placeholder: 'ex: 3x/jour',
                          },
                        },
                        {
                          name: 'duree',
                          type: 'text',
                          required: true,
                          label: 'Durée',
                          admin: {
                            width: '34%',
                            placeholder: 'ex: 7 jours',
                          },
                        },
                      ],
                    },
                    {
                      name: 'instructions',
                      type: 'textarea',
                      label: 'Instructions particulières',
                      admin: {
                        rows: 2,
                        placeholder: "Prendre avec de l'eau, avant/après repas...",
                      },
                    },
                  ],
                },
                {
                  name: 'diagnostic',
                  type: 'textarea',
                  label: 'Diagnostic',
                  admin: {
                    rows: 3,
                  },
                },
                {
                  name: 'notesSupplementaires',
                  type: 'textarea',
                  label: 'Notes supplémentaires',
                  admin: {
                    rows: 2,
                  },
                },
                {
                  type: 'ui',
                  name: 'downloadPrescription',
                  admin: {
                    components: {
                      Field: './components/DownloadPrescriptionButton',
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Vaccinations',
          fields: [],
        },
        {
          label: 'Antécédents',
          fields: [],
        },
      ],
    },
  ],
}

export default Patients
