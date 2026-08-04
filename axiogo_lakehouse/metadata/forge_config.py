# forge_config.py
# Configuration for Forge Layer (Silver) - Cleaning & Logical Transformations
# Schema: workspace.forge
# Purpose: Define transformation rules, calculated columns, and data quality checks

from typing import Dict, List, Any

# =============================================================================
# FORGE LAYER METADATA
# =============================================================================

FORGE_SCHEMA = "workspace.forge"
INTAKE_SCHEMA = "workspace.intake"

# Common transformation patterns
COMMON_TRANSFORMS = {
    "trim_strings": True,
    "standardize_nulls": True,
    "add_ingestion_timestamp": True,
    "add_data_quality_flags": True
}

# =============================================================================
# TABLE TRANSFORMATION CONFIGURATIONS
# =============================================================================

FORGE_TABLES = {
    # BATCH 1: Master Tables
    "gps": {
        "source_table": f"{INTAKE_SCHEMA}.gps",
        "target_table": f"{FORGE_SCHEMA}.gps",
        "batch": "Batch1",
        "priority": 1,
        "description": "Clean GPS data with timestamp fixes and signal validation",
        "timestamp_columns": ["timestamp"],
        "timestamp_format": "yyyy-MM-dd HH:mm:ss",
        "calculated_columns": {
            "signal_quality": "CASE WHEN altitude IS NOT NULL AND speed IS NOT NULL THEN 'GOOD' ELSE 'POOR' END",
            "is_stationary": "speed < 5",
            "data_quality_flag": "CASE WHEN timestamp IS NULL THEN 'MISSING_TIMESTAMP' ELSE 'VALID' END"
        },
        "trim_columns": ["vehicle_id"],
        "partitioning": None,
        "row_count_estimate": 5000
    },
    
    "trip_master": {
        "source_table": f"{INTAKE_SCHEMA}.trip_master",
        "target_table": f"{FORGE_SCHEMA}.trip_master",
        "batch": "Batch1",
        "priority": 1,
        "description": "Clean trip data with duration calculations and validation",
        "timestamp_columns": ["start_time", "end_time"],
        "timestamp_format": "yyyy-MM-dd HH:mm:ss",
        "calculated_columns": {
            "trip_duration_hours": "ROUND((UNIX_TIMESTAMP(end_time) - UNIX_TIMESTAMP(start_time)) / 3600, 2)",
            "calculated_avg_speed": "ROUND(distance_km / NULLIF((UNIX_TIMESTAMP(end_time) - UNIX_TIMESTAMP(start_time)) / 3600, 0), 1)",
            "speed_variance": "ABS(average_speed_kmph - calculated_avg_speed)",
            "trip_time_category": "CASE WHEN HOUR(start_time) BETWEEN 6 AND 11 THEN 'Morning' WHEN HOUR(start_time) BETWEEN 12 AND 17 THEN 'Afternoon' WHEN HOUR(start_time) BETWEEN 18 AND 23 THEN 'Evening' ELSE 'Night' END",
            "is_long_trip": "distance_km > 100",
            "is_valid_speed": "speed_variance < 20",
            "data_quality_flag": "CASE WHEN start_time >= end_time THEN 'INVALID_TIME' WHEN distance_km <= 0 THEN 'INVALID_DISTANCE' ELSE 'VALID' END"
        },
        "trim_columns": ["trip_id", "vehicle_id", "driver_id", "route_id", "trip_status", "weather_id"],
        "partitioning": "trip_status",
        "row_count_estimate": 10000
    },
    
    "driver_master": {
        "source_table": f"{INTAKE_SCHEMA}.driver_master",
        "target_table": f"{FORGE_SCHEMA}.driver_master",
        "batch": "Batch1",
        "priority": 1,
        "description": "Clean driver data with experience categorization and risk indicators",
        "timestamp_columns": [],
        "timestamp_format": "yyyy-MM-dd",
        "calculated_columns": {
            "tenure_years": "ROUND(DATEDIFF(CURRENT_TIMESTAMP(), joining_date) / 365.25, 1)",
            "experience_category": "CASE WHEN experience_years >= 10 THEN 'Highly Experienced' WHEN experience_years >= 3 THEN 'Experienced' ELSE 'New Driver' END",
            "risk_indicator": "CASE WHEN experience_years < 2 THEN 'HIGH' WHEN experience_years < 5 THEN 'MEDIUM' ELSE 'LOW' END",
            "is_veteran_driver": "experience_years >= 15"
        },
        "trim_columns": ["driver_id", "driver_name", "license_number"],
        "uppercase_columns": ["license_number"],
        "partitioning": "experience_category",
        "row_count_estimate": 700
    },
    
    "vehicle_master": {
        "source_table": f"{INTAKE_SCHEMA}.vehicle_master",
        "target_table": f"{FORGE_SCHEMA}.vehicle_master",
        "batch": "Batch1",
        "priority": 1,
        "description": "Clean vehicle data with age calculations and usage metrics",
        "timestamp_columns": ["last_service_date"],
        "timestamp_format": "yyyy-MM-dd",
        "calculated_columns": {
            "vehicle_age_years": "ROUND(DATEDIFF(CURRENT_TIMESTAMP(), purchase_date) / 365.25, 1)",
            "days_since_service": "DATEDIFF(CURRENT_TIMESTAMP(), last_service_date)",
            "vehicle_age_category": "CASE WHEN vehicle_age_years < 3 THEN 'New' WHEN vehicle_age_years < 7 THEN 'Moderate' ELSE 'Old' END",
            "service_overdue": "days_since_service > 180",
            "mileage_category": "CASE WHEN current_odometer_km < 50000 THEN 'Low' WHEN current_odometer_km < 150000 THEN 'Medium' ELSE 'High' END"
        },
        "trim_columns": ["vehicle_id", "registration_number", "vin", "model"],
        "uppercase_columns": ["registration_number", "vin"],
        "partitioning": None,
        "row_count_estimate": 500
    },
    
    "route_master": {
        "source_table": f"{INTAKE_SCHEMA}.route_master",
        "target_table": f"{FORGE_SCHEMA}.route_master",
        "batch": "Batch1",
        "priority": 1,
        "description": "Clean route data with distance validation",
        "timestamp_columns": [],
        "calculated_columns": {
            "avg_speed_kmph": "ROUND((distance_km / NULLIF(estimated_duration_min, 0)) * 60, 1)",
            "is_long_route": "distance_km > 150",
            "route_efficiency": "CASE WHEN avg_speed_kmph > 60 THEN 'Efficient' WHEN avg_speed_kmph > 40 THEN 'Moderate' ELSE 'Slow' END"
        },
        "trim_columns": ["route_id", "source", "destination", "road_type", "traffic_level"],
        "partitioning": None,
        "row_count_estimate": 100
    },
    
    # BATCH 2: Telemetry & IoT Tables
    "core_engine": {
        "source_table": f"{INTAKE_SCHEMA}.core_engine",
        "target_table": f"{FORGE_SCHEMA}.core_engine",
        "batch": "Batch2",
        "priority": 2,
        "description": "Clean engine telemetry with health flags and performance metrics",
        "timestamp_columns": ["timestamp"],
        "timestamp_format": "yyyy-MM-dd HH:mm:ss",
        "calculated_columns": {},
        "trim_columns": ["vehicle_id", "trip_id"],
        "partitioning": None,
        "row_count_estimate": 5000
    },
    
    "core_telemetry": {
        "source_table": f"{INTAKE_SCHEMA}.core_telemetry",
        "target_table": f"{FORGE_SCHEMA}.core_telemetry",
        "batch": "Batch2",
        "priority": 2,
        "description": "Clean telemetry data with anomaly detection flags",
        "timestamp_columns": ["timestamp"],
        "timestamp_format": "yyyy-MM-dd HH:mm:ss",
        "calculated_columns": {},
        "trim_columns": ["vehicle_id", "trip_id"],
        "partitioning": None,
        "row_count_estimate": 5000
    },
    
    "driver_behavior": {
        "source_table": f"{INTAKE_SCHEMA}.driver_behavior",
        "target_table": f"{FORGE_SCHEMA}.driver_behavior",
        "batch": "Batch2",
        "priority": 2,
        "description": "Clean driver behavior data with risk scoring",
        "timestamp_columns": ["timestamp"],
        "timestamp_format": "yyyy-MM-dd HH:mm:ss",
        "calculated_columns": {},
        "trim_columns": ["driver_id", "trip_id", "vehicle_id"],
        "partitioning": None,
        "row_count_estimate": 5000
    },
    
    # BATCH 3: Operational Tables
    "fuel_transactions": {
        "source_table": f"{INTAKE_SCHEMA}.fuel_transactions",
        "target_table": f"{FORGE_SCHEMA}.fuel_transactions",
        "batch": "Batch3",
        "priority": 3,
        "description": "Clean fuel transactions with cost calculations and consumption classification",
        "timestamp_columns": ["transaction_date"],
        "timestamp_format": "yyyy-MM-dd HH:mm:ss",
        "calculated_columns": {},
        "trim_columns": ["transaction_id", "vehicle_id", "station_name"],
        "partitioning": "fuel_type",
        "row_count_estimate": 8000
    },
    
    "insurance_claims": {
        "source_table": f"{INTAKE_SCHEMA}.insurance_claims",
        "target_table": f"{FORGE_SCHEMA}.insurance_claims",
        "batch": "Batch3",
        "priority": 3,
        "description": "Clean insurance claims with validation and aging metrics",
        "timestamp_columns": ["claim_date", "incident_date"],
        "timestamp_format": "yyyy-MM-dd",
        "calculated_columns": {},
        "trim_columns": ["claim_id", "vehicle_id", "driver_id"],
        "partitioning": "claim_status",
        "row_count_estimate": 2000
    },
    
    "maintenance": {
        "source_table": f"{INTAKE_SCHEMA}.maintenance",
        "target_table": f"{FORGE_SCHEMA}.maintenance",
        "batch": "Batch3",
        "priority": 3,
        "description": "Clean maintenance records with cost analysis and frequency metrics",
        "timestamp_columns": ["service_date", "next_service_date"],
        "timestamp_format": "yyyy-MM-dd",
        "calculated_columns": {},
        "trim_columns": ["maintenance_id", "vehicle_id", "service_type", "service_center"],
        "partitioning": "service_type",
        "row_count_estimate": 4000
    },
    
    "weather": {
        "source_table": f"{INTAKE_SCHEMA}.weather",
        "target_table": f"{FORGE_SCHEMA}.weather",
        "batch": "Batch3",
        "priority": 3,
        "description": "Clean weather data with categorization and impact flags",
        "timestamp_columns": ["timestamp"],
        "timestamp_format": "yyyy-MM-dd HH:mm:ss",
        "calculated_columns": {},
        "trim_columns": ["weather_id", "condition", "location_name"],
        "partitioning": "condition",
        "row_count_estimate": 2190
    },
    
    # BATCH 4: Document Tables
    "accident_reports_batch4": {
        "source_table": f"{INTAKE_SCHEMA}.accident_reports_batch4",
        "target_table": f"{FORGE_SCHEMA}.accident_reports_batch4",
        "batch": "Batch4",
        "priority": 4,
        "description": "Clean accident report PDFs with extraction status",
        "timestamp_columns": [],
        "calculated_columns": {},
        "trim_columns": ["file_name", "source_file", "document_type", "batch_id"],
        "partitioning": None,
        "row_count_estimate": 50
    },
    
    "insurance_claims_batch4": {
        "source_table": f"{INTAKE_SCHEMA}.insurance_claims_batch4",
        "target_table": f"{FORGE_SCHEMA}.insurance_claims_batch4",
        "batch": "Batch4",
        "priority": 4,
        "description": "Clean insurance claim PDFs with extraction status",
        "timestamp_columns": [],
        "calculated_columns": {},
        "trim_columns": ["file_name", "source_file", "document_type", "batch_id"],
        "partitioning": None,
        "row_count_estimate": 50
    },
    
    "metadata_batch4_files": {
        "source_table": f"{INTAKE_SCHEMA}.metadata_batch4_files",
        "target_table": f"{FORGE_SCHEMA}.metadata_batch4_files",
        "batch": "Batch4",
        "priority": 4,
        "description": "Clean PDF metadata with standardized column names",
        "timestamp_columns": [],
        "timestamp_format": "yyyy-MM-dd",
        "calculated_columns": {},
        "trim_columns": ["File Name", "File Type", "Batch"],
        "lowercase_columns": ["File Type"],
        "partitioning": None,
        "row_count_estimate": 100
    }
}

# =============================================================================
# TRANSFORMATION ORDER (DEPENDENCY-AWARE)
# =============================================================================

TRANSFORMATION_ORDER = [
    # Batch 1: Master tables (no dependencies)
    "gps",
    "route_master",
    "vehicle_master",
    "driver_master",
    "trip_master",
    
    # Batch 2: Telemetry (depends on Batch 1)
    "core_engine",
    "core_telemetry",
    "driver_behavior",
    
    # Batch 3: Operational (depends on Batch 1)
    "fuel_transactions",
    "insurance_claims",
    "maintenance",
    "weather",
    
    # Batch 4: Documents (independent)
    "accident_reports_batch4",
    "insurance_claims_batch4",
    "metadata_batch4_files"
]

# =============================================================================
# DATA QUALITY RULES
# =============================================================================

DATA_QUALITY_CHECKS = {
    "trip_master": {
        "primary_key": "trip_id",
        "critical_columns": ["vehicle_id", "driver_id", "start_time", "end_time", "distance_km"],
        "null_tolerance": 0.0,  # 0% nulls allowed in critical columns
        "rules": [
            {"check": "start_time < end_time", "severity": "ERROR"},
            {"check": "distance_km > 0", "severity": "ERROR"},
            {"check": "average_speed_kmph >= 0", "severity": "WARNING"}
        ]
    },
    "vehicle_master": {
        "primary_key": "vehicle_id",
        "critical_columns": ["registration_number", "make", "model"],
        "null_tolerance": 0.0,
        "rules": [
            {"check": "vehicle_age_years >= 0", "severity": "ERROR"}
        ]
    },
    "driver_master": {
        "primary_key": "driver_id",
        "critical_columns": ["first_name", "last_name", "license_number"],
        "null_tolerance": 0.0,
        "rules": [
            {"check": "experience_years >= 0", "severity": "ERROR"}
        ]
    }
}

# =============================================================================
# OPTIMIZATION SETTINGS
# =============================================================================

OPTIMIZATION_CONFIG = {
    "enable_partitioning": True,
    "enable_z_ordering": True,
    "optimize_write": True,
    "auto_compact": True,
    "cache_master_tables": ["vehicle_master", "driver_master", "route_master"],
    "broadcast_threshold": "10m",  # Tables smaller than this will be broadcast in joins
    "z_order_columns": {
        "trip_master": ["start_time", "vehicle_id", "driver_id"],
        "fuel_transactions": ["transaction_date", "vehicle_id"],
        "maintenance": ["service_date", "vehicle_id"],
        "insurance_claims": ["claim_date", "vehicle_id"]
    }
}

# =============================================================================
# SUMMARY METADATA
# =============================================================================

FORGE_SUMMARY = {
    "layer_name": "Forge (Silver)",
    "schema_name": FORGE_SCHEMA,
    "total_tables": len(FORGE_TABLES),
    "description": "Cleaned and logically transformed data with business calculations",
    "transformations": [
        "Data type standardization",
        "Timestamp corrections",
        "String trimming and standardization",
        "Calculated business metrics",
        "Data quality flags",
        "Risk indicators and categorizations"
    ]
}

# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def get_table_config(table_name: str) -> Dict:
    """Get configuration for a specific forge table"""
    return FORGE_TABLES.get(table_name, {})

def get_tables_by_batch(batch: str) -> List[str]:
    """Get all tables in a specific batch"""
    return [name for name, config in FORGE_TABLES.items() if config.get('batch') == batch]

def get_tables_by_priority(priority: int) -> List[str]:
    """Get all tables with a specific priority"""
    return [name for name, config in FORGE_TABLES.items() if config.get('priority') == priority]

def estimate_total_rows() -> int:
    """Estimate total rows across all forge tables"""
    return sum(config.get('row_count_estimate', 0) for config in FORGE_TABLES.values())
