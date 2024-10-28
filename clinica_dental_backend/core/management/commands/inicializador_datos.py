# core/management/commands/inicializar_datos.py

from django.core.management.base import BaseCommand
from core.models.tratamientos_model import Especialidad, Categoria, TipoTratamiento

class Command(BaseCommand):
    help = 'Inicializa las especialidades, categorías y tratamientos en la base de datos si no existen'

    def handle(self, *args, **kwargs):
        # Define los datos iniciales
        especialidades_data = [
            {"nombre": "Odontología General"},
            {"nombre": "Ortodoncia"},
            {"nombre": "Endodoncia"},
            {"nombre": "Periodoncia"},
            {"nombre": "Implantología"},
            {"nombre": "Odontopediatría"},
            {"nombre": "Cirugía Oral y Maxilofacial"},
            {"nombre": "Estética Dental"}
        ]

        categorias_data = {
            "Odontología General": [
                {"nombre": "Limpieza Dental Básica", "precio": 200},
                {"nombre": "Examen Dental Completo", "precio": 250},
                {"nombre": "Restauración Compuesta", "precio": 300},
                {"nombre": "Tratamiento de Caries", "precio": 350},
                {"nombre": "Extracción Simple", "precio": 400},
                {"nombre": "Aplicación de Flúor", "precio": 100},
            ],
            "Ortodoncia": [
                {"nombre": "Brackets Metálicos", "precio": 2500},
                {"nombre": "Brackets de Cerámica", "precio": 3000},
                {"nombre": "Alineadores Invisibles", "precio": 4500},
                {"nombre": "Retenedor Fijo", "precio": 1000},
                {"nombre": "Aparatos Funcionales", "precio": 2000},
                {"nombre": "Expansor Palatino", "precio": 1500},
            ],
            "Endodoncia": [
                {"nombre": "Tratamiento de Conducto Molar", "precio": 1500},
                {"nombre": "Tratamiento de Conducto Premolar", "precio": 1200},
                {"nombre": "Retratamiento Endodóntico", "precio": 2000},
                {"nombre": "Microcirugía Apical", "precio": 2500},
                {"nombre": "Reparación de Fracturas", "precio": 1300},
                {"nombre": "Reconstrucción Post-Endodoncia", "precio": 800},
            ],
            "Periodoncia": [
                {"nombre": "Limpieza Profunda", "precio": 800},
                {"nombre": "Curetaje Dental", "precio": 700},
                {"nombre": "Cirugía de Encías", "precio": 1500},
                {"nombre": "Mantenimiento Periodontal", "precio": 500},
                {"nombre": "Cirugía de Injerto", "precio": 2000},
                {"nombre": "Tratamiento de Gingivitis", "precio": 600},
            ],
            "Implantología": [
                {"nombre": "Implante de Diente Único", "precio": 8000},
                {"nombre": "Implante de Prótesis Parcial", "precio": 10000},
                {"nombre": "Injerto Óseo para Implante", "precio": 3000},
                {"nombre": "Elevación del Seno Maxilar", "precio": 3500},
                {"nombre": "Implante Subperióstico", "precio": 9000},
                {"nombre": "Carga Inmediata en Implantes", "precio": 7500},
            ],
            "Odontopediatría": [
                {"nombre": "Selladores de Fisuras", "precio": 300},
                {"nombre": "Profilaxis Infantil", "precio": 200},
                {"nombre": "Aplicación de Fluoruro Infantil", "precio": 150},
                {"nombre": "Terapia Pulpal", "precio": 500},
                {"nombre": "Coronas Pediátricas", "precio": 600},
                {"nombre": "Educación en Higiene Oral", "precio": 100},
            ],
            "Cirugía Oral y Maxilofacial": [
                {"nombre": "Extracción de Muelas del Juicio", "precio": 2000},
                {"nombre": "Reducción de Fracturas Mandibulares", "precio": 4500},
                {"nombre": "Cirugía Ortognática", "precio": 12000},
                {"nombre": "Biopsia de Lesiones", "precio": 1000},
                {"nombre": "Corrección de Labio Leporino", "precio": 8500},
                {"nombre": "Extracción de Tumores", "precio": 5000},
            ],
            "Estética Dental": [
                {"nombre": "Blanqueamiento Dental", "precio": 1200},
                {"nombre": "Carillas de Porcelana", "precio": 4000},
                {"nombre": "Contorneado de Encías", "precio": 1500},
                {"nombre": "Reconstrucción de Dientes Fracturados", "precio": 2500},
                {"nombre": "Ajuste Estético de Encías", "precio": 1800},
                {"nombre": "Carillas de Resina", "precio": 3500},
            ]
        }

        # Agregar Especialidades y Tratamientos
        for especialidad_data in especialidades_data:
            especialidad, _ = Especialidad.objects.get_or_create(**especialidad_data)
            
            for tratamiento_data in categorias_data.get(especialidad.nombre, []):
                categoria, _ = Categoria.objects.get_or_create(
                    especialidad=especialidad,
                    nombre=tratamiento_data["nombre"]
                )
                TipoTratamiento.objects.get_or_create(
                    categoria=categoria,
                    nombre=tratamiento_data["nombre"],
                    precio=tratamiento_data["precio"]
                )

        self.stdout.write(self.style.SUCCESS('Datos iniciales agregados correctamente si no existían'))
