# intake_config.py
# Auto-generated Metadata Configuration for Intake Layer (Bronze) Tables
# Schema: workspace.intake
# Includes source file paths and loading specifications

INTAKE_TABLES = {
    # BATCH 1 - CSV Files (Master Data)
    "vehicle_master": {
        "table_name": "workspace.intake.vehicle_master",
        "source_path": "/Volumes/workspace/intake/source_system/AutoMind_Batch1/vehicle_master.csv",
        "file_format": "csv",
        "batch": "Batch1",
        "load_options": {"header": True, "inferSchema": True}
    },
    "driver_master": {
        "table_name": "workspace.intake.driver_master",
        "source_path": "/Volumes/workspace/intake/source_system/AutoMind_Batch1/driver_master.csv",
        "file_format": "csv",
        "batch": "Batch1",
        "load_options": {"header": True, "inferSchema": True}
    },
    "route_master": {
        "table_name": "workspace.intake.route_master",
        "source_path": "/Volumes/workspace/intake/source_system/AutoMind_Batch1/route_master.csv",
        "file_format": "csv",
        "batch": "Batch1",
        "load_options": {"header": True, "inferSchema": True}
    },
    "trip_master": {
        "table_name": "workspace.intake.trip_master",
        "source_path": "/Volumes/workspace/intake/source_system/AutoMind_Batch1/trip_master.csv",
        "file_format": "csv",
        "batch": "Batch1",
        "load_options": {"header": True, "inferSchema": True}
    },
    
    # BATCH 2 - JSON Files (Telemetry Data)
    "driver_behavior": {
        "table_name": "workspace.intake.driver_behavior",
        "source_path": "/Volumes/workspace/intake/source_system/AutoMind_Batch2/driver_behavior_001.json",
        "file_format": "json",
        "batch": "Batch2",
        "load_options": {"multiline": True}
    },
    "core_engine": {
        "table_name": "workspace.intake.core_engine",
        "source_path": "/Volumes/workspace/intake/source_system/AutoMind_Batch2/engine_001.json",
        "file_format": "json",
        "batch": "Batch2",
        "load_options": {"multiline": True}
    },
    "gps": {
        "table_name": "workspace.intake.gps",
        "source_path": "/Volumes/workspace/intake/source_system/AutoMind_Batch2/gps_001.json",
        "file_format": "json",
        "batch": "Batch2",
        "load_options": {"multiline": True}
    },
    "core_telemetry": {
        "table_name": "workspace.intake.core_telemetry",
        "source_path": "/Volumes/workspace/intake/source_system/AutoMind_Batch2/telemetry_001.json",
        "file_format": "json",
        "batch": "Batch2",
        "load_options": {"multiline": True}
    },
    
    # BATCH 3 - Mixed Format (Transactional/Operational Data)
    "fuel_transactions": {
        "table_name": "workspace.intake.fuel_transactions",
        "source_path": "/Volumes/workspace/intake/source_system/AutoMind_Batch3/fuel_transactions.xlsx",
        "file_format": "excel",
        "batch": "Batch3",
        "load_options": {}
    },
    "insurance_claims": {
        "table_name": "workspace.intake.insurance_claims",
        "source_path": "/Volumes/workspace/intake/source_system/AutoMind_Batch3/insurance_claims.csv",
        "file_format": "csv",
        "batch": "Batch3",
        "load_options": {"header": True, "inferSchema": True}
    },
    "maintenance": {
        "table_name": "workspace.intake.maintenance",
        "source_path": "/Volumes/workspace/intake/source_system/AutoMind_Batch3/maintenance.csv",
        "file_format": "csv",
        "batch": "Batch3",
        "load_options": {"header": True, "inferSchema": True}
    },
    "weather": {
        "table_name": "workspace.intake.weather",
        "source_path": "/Volumes/workspace/intake/source_system/AutoMind_Batch3/weather_001.json",
        "file_format": "json",
        "batch": "Batch3",
        "load_options": {"multiline": True}
    },
    
    # BATCH 4 - Documents (PDFs and Metadata)
    "accident_reports_batch4": {
        "table_name": "workspace.intake.accident_reports_batch4",
        "source_path": "/Volumes/workspace/intake/source_system/AutoMind_Batch4/ProfessionalSyntheticInsuranceDataset_v2/AccidentReports/",
        "file_format": "pdf",
        "batch": "Batch4",
        "load_options": {"pathGlobFilter": "*.pdf"},
        "document_type": "Accident Report"
    },
    "insurance_claims_batch4": {
        "table_name": "workspace.intake.insurance_claims_batch4",
        "source_path": "/Volumes/workspace/intake/source_system/AutoMind_Batch4/ProfessionalSyntheticInsuranceDataset_v2/InsuranceClaims/",
        "file_format": "pdf",
        "batch": "Batch4",
        "load_options": {"pathGlobFilter": "*.pdf"},
        "document_type": "Insurance Claim"
    },
    "metadata_batch4_files": {
        "table_name": "workspace.intake.metadata_batch4_files",
        "source_path": "/Volumes/workspace/intake/source_system/AutoMind_Batch4/ProfessionalSyntheticInsuranceDataset_v2/metadata.xlsx",
        "file_format": "excel",
        "batch": "Batch4",
        "load_options": {}
    }
}

# Load order by batch
LOAD_ORDER = [
    "vehicle_master", "driver_master", "route_master", "trip_master",  # Batch 1
    "driver_behavior", "core_engine", "gps", "core_telemetry",  # Batch 2
    "fuel_transactions", "insurance_claims", "maintenance", "weather",  # Batch 3
    "accident_reports_batch4", "insurance_claims_batch4", "metadata_batch4_files"  # Batch 4
]
