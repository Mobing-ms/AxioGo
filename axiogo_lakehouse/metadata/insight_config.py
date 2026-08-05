# insight_config.py
# Configuration for Insight Layer (Gold) - Dimensional Model & Business Analytics
# Schema: workspace.insight
# Purpose: Define star schema dimensions, fact tables, aggregations, and business metrics

from typing import Dict, List, Any

# =============================================================================
# INSIGHT LAYER METADATA
# =============================================================================

INSIGHT_SCHEMA = "workspace.insight"
FORGE_SCHEMA = "workspace.forge"

# =============================================================================
# DIMENSION TABLES CONFIGURATION
# =============================================================================

DIMENSION_TABLES = {
    "dim_vehicle": {
        "source_tables": [f"{FORGE_SCHEMA}.vehicle_master"],
        "target_table": f"{INSIGHT_SCHEMA}.dim_vehicle",
        "type": "dimension",
        "scd_type": "SCD Type 2",  # Track history
        "business_key": "vehicle_id",
        "description": "Vehicle dimension with attributes and classifications",
        "columns": {
            "vehicle_key": "BIGINT",  # Surrogate key
            "vehicle_id": "STRING",   # Business key
            "registration_number": "STRING",
            "vin": "STRING",
            "model": "STRING",
            "make": "STRING",
            "year": "INT",
            "fuel_type": "STRING",
            "vehicle_type": "STRING",
            "capacity": "DOUBLE",
            "current_odometer_km": "BIGINT",
            "purchase_date": "DATE",
            "last_service_date": "TIMESTAMP",
            "status": "STRING",
            # Calculated attributes from forge
            "vehicle_age_years": "DOUBLE",
            "vehicle_age_category": "STRING",
            "days_since_service": "INT",
            "service_overdue": "BOOLEAN",
            "mileage_category": "STRING",
            # SCD Type 2 columns
            "effective_date": "TIMESTAMP",
            "end_date": "TIMESTAMP",
            "is_current": "BOOLEAN",
            "version": "INT"
        },
        "primary_key": "vehicle_key",
        "indexes": ["vehicle_id", "registration_number", "status"],
        "partitioning": None,
        "z_order": ["vehicle_id", "status"]
    },
    
    "dim_driver": {
        "source_tables": [f"{FORGE_SCHEMA}.driver_master"],
        "target_table": f"{INSIGHT_SCHEMA}.dim_driver",
        "type": "dimension",
        "scd_type": "SCD Type 2",
        "business_key": "driver_id",
        "description": "Driver dimension with experience and risk profile",
        "columns": {
            "driver_key": "BIGINT",
            "driver_id": "STRING",
            "driver_name": "STRING",
            "license_number": "STRING",
            "contact_number": "STRING",
            "email": "STRING",
            "address": "STRING",
            "joining_date": "DATE",
            "experience_years": "INT",
            "status": "STRING",
            # Calculated attributes
            "tenure_years": "DOUBLE",
            "experience_category": "STRING",
            "risk_indicator": "STRING",
            "is_veteran_driver": "BOOLEAN",
            # SCD Type 2
            "effective_date": "TIMESTAMP",
            "end_date": "TIMESTAMP",
            "is_current": "BOOLEAN",
            "version": "INT"
        },
        "primary_key": "driver_key",
        "indexes": ["driver_id", "license_number", "status"],
        "partitioning": None,
        "z_order": ["driver_id", "status"]
    },
    
    "dim_route": {
        "source_tables": [f"{FORGE_SCHEMA}.route_master"],
        "target_table": f"{INSIGHT_SCHEMA}.dim_route",
        "type": "dimension",
        "scd_type": "SCD Type 1",  # No history needed
        "business_key": "route_id",
        "description": "Route dimension with distance and traffic characteristics",
        "columns": {
            "route_key": "BIGINT",
            "route_id": "STRING",
            "source": "STRING",
            "destination": "STRING",
            "distance_km": "DOUBLE",
            "estimated_duration_min": "INT",
            "road_type": "STRING",
            "traffic_level": "STRING",
            "toll_amount": "DOUBLE",
            # Calculated attributes
            "avg_speed_kmph": "DOUBLE",
            "is_long_route": "BOOLEAN",
            "route_efficiency": "STRING"
        },
        "primary_key": "route_key",
        "indexes": ["route_id", "source", "destination"],
        "partitioning": None,
        "z_order": ["route_id"]
    },
    
    "dim_weather": {
        "source_tables": [f"{FORGE_SCHEMA}.weather"],
        "target_table": f"{INSIGHT_SCHEMA}.dim_weather",
        "type": "dimension",
        "scd_type": "SCD Type 1",
        "business_key": "weather_id",
        "description": "Weather dimension with conditions and severity",
        "columns": {
            "weather_key": "BIGINT",
            "weather_id": "STRING",
            "location": "STRING",
            "city": "STRING",
            "timestamp": "TIMESTAMP",
            "condition": "STRING",
            "temperature_c": "DOUBLE",
            "humidity_pct": "DOUBLE",
            "wind_speed_kmph": "DOUBLE",
            "visibility_km": "DOUBLE",
            "precipitation_mm": "DOUBLE",
            # Categorization
            "weather_severity": "STRING",
            "is_adverse_weather": "BOOLEAN"
        },
        "primary_key": "weather_key",
        "indexes": ["weather_id", "location", "condition"],
        "partitioning": None,
        "z_order": ["weather_id", "location"]
    },
    
    "dim_date": {
        "source_tables": [],  # Generated dimension
        "target_table": f"{INSIGHT_SCHEMA}.dim_date",
        "type": "dimension",
        "scd_type": "Static",
        "business_key": "date_key",
        "description": "Date dimension for time intelligence",
        "columns": {
            "date_key": "INT",  # YYYYMMDD format
            "full_date": "DATE",
            "year": "INT",
            "quarter": "INT",
            "month": "INT",
            "month_name": "STRING",
            "week_of_year": "INT",
            "day_of_month": "INT",
            "day_of_week": "INT",
            "day_name": "STRING",
            "is_weekend": "BOOLEAN",
            "is_holiday": "BOOLEAN",
            "holiday_name": "STRING",
            "fiscal_year": "INT",
            "fiscal_quarter": "INT",
            "fiscal_month": "INT"
        },
        "primary_key": "date_key",
        "indexes": ["full_date", "year", "month"],
        "date_range": {"start": "2020-01-01", "end": "2030-12-31"},
        "partitioning": None,
        "z_order": ["full_date"]
    },
    
    "dim_location": {
        "source_tables": [f"{FORGE_SCHEMA}.gps"],  # Extract unique locations
        "target_table": f"{INSIGHT_SCHEMA}.dim_location",
        "type": "dimension",
        "scd_type": "SCD Type 1",
        "business_key": "location_id",
        "description": "Location dimension for geographic analysis",
        "columns": {
            "location_key": "BIGINT",
            "location_id": "STRING",
            "latitude": "DOUBLE",
            "longitude": "DOUBLE",
            "city": "STRING",
            "state": "STRING",
            "country": "STRING",
            "postal_code": "STRING",
            "region": "STRING",
            "location_type": "STRING"  # depot, station, rest_area, etc.
        },
        "primary_key": "location_key",
        "indexes": ["location_id", "city", "region"],
        "partitioning": None,
        "z_order": ["location_id", "city"]
    }
}

# =============================================================================
# FACT TABLES CONFIGURATION (Transaction Level)
# =============================================================================

FACT_TABLES = {
    "fact_trip": {
        "source_tables": [
            f"{FORGE_SCHEMA}.trip_master",
            f"{FORGE_SCHEMA}.gps",
            f"{FORGE_SCHEMA}.core_telemetry"
        ],
        "target_table": f"{INSIGHT_SCHEMA}.fact_trip",
        "type": "fact",
        "grain": "One row per trip",
        "description": "Trip transaction fact with detailed metrics",
        "dimensions": [
            "vehicle_key",
            "driver_key",
            "route_key",
            "weather_key",
            "start_date_key",
            "end_date_key"
        ],
        "measures": {
            "distance_km": "DOUBLE",
            "duration_hours": "DOUBLE",
            "average_speed_kmph": "DOUBLE",
            "max_speed_kmph": "DOUBLE",
            "fuel_consumed_l": "DOUBLE",
            "fuel_efficiency_kmpl": "DOUBLE",
            "idle_time_minutes": "DOUBLE",
            "harsh_braking_count": "INT",
            "rapid_acceleration_count": "INT",
            "overspeed_count": "INT",
            "trip_cost": "DOUBLE",
            "toll_amount": "DOUBLE",
            # Flags
            "is_completed": "BOOLEAN",
            "had_incident": "BOOLEAN",
            "violated_speed": "BOOLEAN"
        },
        "degenerate_dimensions": [
            "trip_id",
            "trip_status"
        ],
        "partitioning": "start_date_key",
        "z_order": ["vehicle_key", "driver_key", "start_date_key"],
        "aggregation_enabled": True
    },
    
    "fact_gps_tracking": {
        "source_tables": [f"{FORGE_SCHEMA}.gps"],
        "target_table": f"{INSIGHT_SCHEMA}.fact_gps_tracking",
        "type": "fact",
        "grain": "One row per GPS point",
        "description": "Detailed GPS tracking fact for route analysis",
        "dimensions": [
            "vehicle_key",
            "driver_key",
            "location_key",
            "date_key"
        ],
        "measures": {
            "latitude": "DOUBLE",
            "longitude": "DOUBLE",
            "altitude": "DOUBLE",
            "speed": "DOUBLE",
            "heading": "DOUBLE",
            "accuracy": "DOUBLE",
            "gps_quality_score": "INT"
        },
        "degenerate_dimensions": [
            "trip_id",
            "gps_id"
        ],
        "partitioning": "date_key",
        "z_order": ["vehicle_key", "date_key"],
        "aggregation_enabled": False  # Too granular
    },
    
    "fact_telemetry": {
        "source_tables": [
            f"{FORGE_SCHEMA}.core_telemetry",
            f"{FORGE_SCHEMA}.core_engine"
        ],
        "target_table": f"{INSIGHT_SCHEMA}.fact_telemetry",
        "type": "fact",
        "grain": "One row per telemetry reading",
        "description": "Vehicle telemetry fact for health monitoring",
        "dimensions": [
            "vehicle_key",
            "driver_key",
            "date_key"
        ],
        "measures": {
            "engine_rpm": "INT",
            "engine_temperature": "INT",
            "engine_load": "INT",
            "fuel_level": "DOUBLE",
            "fuel_efficiency": "DOUBLE",
            "oil_pressure": "DOUBLE",
            "coolant_temperature": "INT",
            "battery_voltage": "DOUBLE",
            "idle_time": "INT",
            "engine_health_score": "INT"
        },
        "degenerate_dimensions": [
            "trip_id",
            "telemetry_id"
        ],
        "partitioning": "date_key",
        "z_order": ["vehicle_key", "date_key"],
        "aggregation_enabled": True
    },
    
    "fact_driver_behavior": {
        "source_tables": [f"{FORGE_SCHEMA}.driver_behavior"],
        "target_table": f"{INSIGHT_SCHEMA}.fact_driver_behavior",
        "type": "fact",
        "grain": "One row per behavior event",
        "description": "Driver behavior fact for safety analysis",
        "dimensions": [
            "vehicle_key",
            "driver_key",
            "date_key"
        ],
        "measures": {
            "harsh_braking_count": "INT",
            "rapid_acceleration_count": "INT",
            "sharp_turn_count": "INT",
            "overspeed_duration_sec": "INT",
            "idle_duration_sec": "INT",
            "phone_usage_duration_sec": "INT",
            "seatbelt_violation_count": "INT",
            "behavior_score": "DOUBLE",
            "risk_score": "DOUBLE"
        },
        "degenerate_dimensions": [
            "trip_id",
            "behavior_id"
        ],
        "partitioning": "date_key",
        "z_order": ["driver_key", "date_key"],
        "aggregation_enabled": True
    },
    
    "fact_fuel_transaction": {
        "source_tables": [f"{FORGE_SCHEMA}.fuel_transactions"],
        "target_table": f"{INSIGHT_SCHEMA}.fact_fuel_transaction",
        "type": "fact",
        "grain": "One row per fuel transaction",
        "description": "Fuel transaction fact for cost analysis",
        "dimensions": [
            "vehicle_key",
            "driver_key",
            "date_key"
        ],
        "measures": {
            "fuel_quantity_l": "DOUBLE",
            "fuel_price_per_l": "DOUBLE",
            "total_cost": "DOUBLE",
            "odometer_reading": "BIGINT",
            "trip_distance_since_last_fuel": "DOUBLE",
            "fuel_efficiency_kmpl": "DOUBLE"
        },
        "degenerate_dimensions": [
            "fuel_id",
            "fuel_station",
            "fuel_type",
            "payment_method"
        ],
        "partitioning": "date_key",
        "z_order": ["vehicle_key", "date_key"],
        "aggregation_enabled": True
    },
    
    "fact_maintenance": {
        "source_tables": [f"{FORGE_SCHEMA}.maintenance"],
        "target_table": f"{INSIGHT_SCHEMA}.fact_maintenance",
        "type": "fact",
        "grain": "One row per maintenance event",
        "description": "Maintenance fact for cost and downtime analysis",
        "dimensions": [
            "vehicle_key",
            "date_key"
        ],
        "measures": {
            "labour_cost": "DOUBLE",
            "parts_cost": "DOUBLE",
            "total_cost": "DOUBLE",
            "downtime_hours": "DOUBLE",
            "odometer_at_service": "BIGINT",
            "days_since_last_service": "INT"
        },
        "degenerate_dimensions": [
            "service_id",
            "service_type",
            "service_category",
            "workshop",
            "technician",
            "warranty_claim"
        ],
        "partitioning": "date_key",
        "z_order": ["vehicle_key", "date_key"],
        "aggregation_enabled": True
    },
    
    "fact_insurance_claim": {
        "source_tables": [f"{FORGE_SCHEMA}.insurance_claims"],
        "target_table": f"{INSIGHT_SCHEMA}.fact_insurance_claim",
        "type": "fact",
        "grain": "One row per insurance claim",
        "description": "Insurance claim fact for risk analysis",
        "dimensions": [
            "vehicle_key",
            "driver_key",
            "weather_key",
            "date_key"
        ],
        "measures": {
            "claim_amount": "DOUBLE",
            "estimated_repair_cost": "DOUBLE",
            "actual_repair_cost": "DOUBLE",
            "days_to_settle": "INT",
            "cost_variance": "DOUBLE"
        },
        "degenerate_dimensions": [
            "claim_id",
            "claim_status",
            "collision_type",
            "severity",
            "accident_location",
            "road_condition",
            "fraud_flag"
        ],
        "partitioning": "date_key",
        "z_order": ["vehicle_key", "driver_key", "date_key"],
        "aggregation_enabled": True
    }
}

# =============================================================================
# AGGREGATED FACT TABLES (Pre-computed Summaries)
# =============================================================================

AGGREGATED_FACTS = {
    "agg_vehicle_daily": {
        "source_facts": ["fact_trip", "fact_telemetry", "fact_fuel_transaction"],
        "target_table": f"{INSIGHT_SCHEMA}.agg_vehicle_daily",
        "type": "aggregated_fact",
        "grain": "One row per vehicle per day",
        "description": "Daily vehicle performance summary",
        "dimensions": [
            "vehicle_key",
            "date_key"
        ],
        "measures": {
            "total_trips": "INT",
            "total_distance_km": "DOUBLE",
            "total_duration_hours": "DOUBLE",
            "avg_speed_kmph": "DOUBLE",
            "max_speed_kmph": "DOUBLE",
            "total_fuel_consumed_l": "DOUBLE",
            "avg_fuel_efficiency_kmpl": "DOUBLE",
            "total_idle_time_minutes": "DOUBLE",
            "total_harsh_braking": "INT",
            "total_rapid_acceleration": "INT",
            "total_overspeed_incidents": "INT",
            "avg_engine_health_score": "DOUBLE",
            "total_fuel_cost": "DOUBLE",
            "utilization_hours": "DOUBLE",
            "utilization_pct": "DOUBLE"
        },
        "partitioning": "date_key",
        "z_order": ["vehicle_key", "date_key"],
        "refresh_frequency": "daily"
    },
    
    "agg_driver_daily": {
        "source_facts": ["fact_trip", "fact_driver_behavior"],
        "target_table": f"{INSIGHT_SCHEMA}.agg_driver_daily",
        "type": "aggregated_fact",
        "grain": "One row per driver per day",
        "description": "Daily driver performance and safety summary",
        "dimensions": [
            "driver_key",
            "date_key"
        ],
        "measures": {
            "total_trips": "INT",
            "total_distance_km": "DOUBLE",
            "total_duration_hours": "DOUBLE",
            "avg_speed_kmph": "DOUBLE",
            "total_harsh_braking": "INT",
            "total_rapid_acceleration": "INT",
            "total_sharp_turns": "INT",
            "total_overspeed_duration_min": "DOUBLE",
            "avg_behavior_score": "DOUBLE",
            "avg_risk_score": "DOUBLE",
            "safety_violations": "INT",
            "incidents_count": "INT"
        },
        "partitioning": "date_key",
        "z_order": ["driver_key", "date_key"],
        "refresh_frequency": "daily"
    },
    
    "agg_route_summary": {
        "source_facts": ["fact_trip"],
        "target_table": f"{INSIGHT_SCHEMA}.agg_route_summary",
        "type": "aggregated_fact",
        "grain": "One row per route (all time)",
        "description": "Route performance summary across all trips",
        "dimensions": [
            "route_key"
        ],
        "measures": {
            "total_trips": "INT",
            "avg_duration_hours": "DOUBLE",
            "min_duration_hours": "DOUBLE",
            "max_duration_hours": "DOUBLE",
            "avg_speed_kmph": "DOUBLE",
            "avg_fuel_efficiency_kmpl": "DOUBLE",
            "total_fuel_consumed_l": "DOUBLE",
            "incident_count": "INT",
            "incident_rate_pct": "DOUBLE",
            "avg_traffic_delay_minutes": "DOUBLE",
            "on_time_delivery_pct": "DOUBLE",
            "last_trip_date": "DATE",
            "first_trip_date": "DATE"
        },
        "partitioning": None,
        "z_order": ["route_key"],
        "refresh_frequency": "weekly"
    },
    
    "agg_fuel_summary": {
        "source_facts": ["fact_fuel_transaction"],
        "target_table": f"{INSIGHT_SCHEMA}.agg_fuel_summary",
        "type": "aggregated_fact",
        "grain": "One row per vehicle per month",
        "description": "Monthly fuel consumption and cost summary",
        "dimensions": [
            "vehicle_key",
            "year",
            "month"
        ],
        "measures": {
            "total_transactions": "INT",
            "total_fuel_quantity_l": "DOUBLE",
            "total_fuel_cost": "DOUBLE",
            "avg_fuel_price_per_l": "DOUBLE",
            "avg_fuel_efficiency_kmpl": "DOUBLE",
            "total_distance_km": "DOUBLE",
            "cost_per_km": "DOUBLE"
        },
        "partitioning": "year",
        "z_order": ["vehicle_key", "year", "month"],
        "refresh_frequency": "monthly"
    },
    
    "agg_maintenance_summary": {
        "source_facts": ["fact_maintenance"],
        "target_table": f"{INSIGHT_SCHEMA}.agg_maintenance_summary",
        "type": "aggregated_fact",
        "grain": "One row per vehicle per quarter",
        "description": "Quarterly maintenance cost and downtime summary",
        "dimensions": [
            "vehicle_key",
            "year",
            "quarter"
        ],
        "measures": {
            "total_maintenance_events": "INT",
            "preventive_maintenance_count": "INT",
            "breakdown_count": "INT",
            "total_labour_cost": "DOUBLE",
            "total_parts_cost": "DOUBLE",
            "total_cost": "DOUBLE",
            "total_downtime_hours": "DOUBLE",
            "avg_cost_per_event": "DOUBLE",
            "avg_downtime_per_event_hours": "DOUBLE",
            "warranty_claim_count": "INT"
        },
        "partitioning": "year",
        "z_order": ["vehicle_key", "year", "quarter"],
        "refresh_frequency": "monthly"
    }
}

# =============================================================================
# BUSINESS METRICS & KPIs
# =============================================================================

BUSINESS_METRICS = {
    "fleet_utilization": {
        "description": "Percentage of time vehicles are actively being used",
        "formula": "(total_trip_hours / (24 * active_vehicles_count)) * 100",
        "target": 75.0,
        "unit": "percent"
    },
    "fuel_efficiency": {
        "description": "Average kilometers per liter across fleet",
        "formula": "total_distance_km / total_fuel_consumed_l",
        "target": 8.0,
        "unit": "kmpl"
    },
    "maintenance_cost_per_km": {
        "description": "Average maintenance cost per kilometer",
        "formula": "total_maintenance_cost / total_distance_km",
        "target": 0.50,
        "unit": "currency_per_km"
    },
    "driver_safety_score": {
        "description": "Average driver behavior score (0-100)",
        "formula": "AVG(behavior_score)",
        "target": 85.0,
        "unit": "score"
    },
    "on_time_delivery_rate": {
        "description": "Percentage of trips completed on time",
        "formula": "(on_time_trips / total_trips) * 100",
        "target": 95.0,
        "unit": "percent"
    },
    "incident_rate": {
        "description": "Number of incidents per 1000 km",
        "formula": "(total_incidents / total_distance_km) * 1000",
        "target": 0.5,
        "unit": "per_1000km"
    },
    "vehicle_downtime_pct": {
        "description": "Percentage of time vehicles are unavailable due to maintenance",
        "formula": "(total_downtime_hours / (24 * 30 * fleet_size)) * 100",
        "target": 5.0,
        "unit": "percent"
    }
}

# =============================================================================
# DATA QUALITY CHECKS FOR INSIGHT LAYER
# =============================================================================

INSIGHT_DATA_QUALITY = {
    "dim_vehicle": [
        {"check": "uniqueness", "column": "vehicle_key", "threshold": 100},
        {"check": "not_null", "column": "vehicle_id", "threshold": 100},
        {"check": "not_null", "column": "registration_number", "threshold": 100},
        {"check": "referential_integrity", "column": "vehicle_id", "reference_table": "forge.vehicle_master"}
    ],
    "dim_driver": [
        {"check": "uniqueness", "column": "driver_key", "threshold": 100},
        {"check": "not_null", "column": "driver_id", "threshold": 100},
        {"check": "not_null", "column": "license_number", "threshold": 100}
    ],
    "fact_trip": [
        {"check": "not_null", "column": "vehicle_key", "threshold": 100},
        {"check": "not_null", "column": "driver_key", "threshold": 100},
        {"check": "not_null", "column": "start_date_key", "threshold": 100},
        {"check": "positive_value", "column": "distance_km", "threshold": 95},
        {"check": "positive_value", "column": "duration_hours", "threshold": 95},
        {"check": "referential_integrity", "column": "vehicle_key", "reference_table": "insight.dim_vehicle"},
        {"check": "referential_integrity", "column": "driver_key", "reference_table": "insight.dim_driver"}
    ],
    "agg_vehicle_daily": [
        {"check": "not_null", "column": "vehicle_key", "threshold": 100},
        {"check": "not_null", "column": "date_key", "threshold": 100},
        {"check": "positive_value", "column": "total_trips", "threshold": 100},
        {"check": "uniqueness", "columns": ["vehicle_key", "date_key"], "threshold": 100}
    ]
}

# =============================================================================
# TRANSFORMATION ORDER (Dependencies)
# =============================================================================

TRANSFORMATION_ORDER = [
    # Phase 1: Dimensions (no dependencies)
    "dim_date",
    "dim_location",
    "dim_vehicle",
    "dim_driver",
    "dim_route",
    "dim_weather",
    
    # Phase 2: Transaction Facts (depend on dimensions)
    "fact_trip",
    "fact_gps_tracking",
    "fact_telemetry",
    "fact_driver_behavior",
    "fact_fuel_transaction",
    "fact_maintenance",
    "fact_insurance_claim",
    
    # Phase 3: Aggregated Facts (depend on transaction facts)
    "agg_vehicle_daily",
    "agg_driver_daily",
    "agg_route_summary",
    "agg_fuel_summary",
    "agg_maintenance_summary"
]

# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def get_table_config(table_name: str) -> Dict[str, Any]:
    """Get configuration for a specific table"""
    if table_name in DIMENSION_TABLES:
        return DIMENSION_TABLES[table_name]
    elif table_name in FACT_TABLES:
        return FACT_TABLES[table_name]
    elif table_name in AGGREGATED_FACTS:
        return AGGREGATED_FACTS[table_name]
    return None

def get_all_dimensions() -> List[str]:
    """Get list of all dimension table names"""
    return list(DIMENSION_TABLES.keys())

def get_all_facts() -> List[str]:
    """Get list of all fact table names"""
    return list(FACT_TABLES.keys())

def get_all_aggregations() -> List[str]:
    """Get list of all aggregated fact table names"""
    return list(AGGREGATED_FACTS.keys())

def print_insight_summary():
    """Print configuration summary"""
    print("=" * 80)
    print("INSIGHT LAYER (GOLD) CONFIGURATION LOADED")
    print("=" * 80)
    print(f"Schema: {INSIGHT_SCHEMA}")
    print(f"Dimension Tables: {len(DIMENSION_TABLES)}")
    print(f"Fact Tables: {len(FACT_TABLES)}")
    print(f"Aggregated Facts: {len(AGGREGATED_FACTS)}")
    print(f"Total Tables: {len(TRANSFORMATION_ORDER)}")
    print(f"Business Metrics: {len(BUSINESS_METRICS)}")
    print(f"Transformation Order: {', '.join(TRANSFORMATION_ORDER[:5])}...")
    print("✅ Ready to build star schema!")
    print("=" * 80)

# Auto-print on import
print_insight_summary()
