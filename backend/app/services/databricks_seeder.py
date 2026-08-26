import os
import json
import sqlite3
import pandas as pd
from datetime import datetime, timedelta

def get_paths():
    # Base dir is the backend root or the repository root
    # Let's find it by looking for axiogo_lakehouse
    current_dir = os.path.dirname(os.path.abspath(__file__))
    # Walk up to find axiogo_lakehouse
    while current_dir and not os.path.isdir(os.path.join(current_dir, "axiogo_lakehouse")):
        parent = os.path.dirname(current_dir)
        if parent == current_dir:
            break
        current_dir = parent
    
    base_dir = current_dir
    datasets_dir = os.path.join(base_dir, "axiogo_lakehouse", "datasets")
    return base_dir, datasets_dir

def seed_sqlite_lakehouse(db_path: str):
    print(f"Seeding local SQLite Lakehouse at: {db_path}")
    base_dir, datasets_dir = get_paths()
    print(f"Loading datasets from: {datasets_dir}")
    
    conn = sqlite3.connect(db_path)
    
    # ----------------------------------------------------
    # 1. Load silver/raw data into dataframes
    # ----------------------------------------------------
    
    # Batch 1
    vehicle_df = pd.read_csv(os.path.join(datasets_dir, "Automind_Batch1", "vehicle_master.csv"))
    driver_df = pd.read_csv(os.path.join(datasets_dir, "Automind_Batch1", "driver_master.csv"))
    route_df = pd.read_csv(os.path.join(datasets_dir, "Automind_Batch1", "route_master.csv"))
    trip_df = pd.read_csv(os.path.join(datasets_dir, "Automind_Batch1", "trip_master.csv"))
    
    # Batch 2
    with open(os.path.join(datasets_dir, "Automind_batch2", "driver_behavior_001.json"), "r") as f:
        behavior_df = pd.DataFrame(json.load(f))
    with open(os.path.join(datasets_dir, "Automind_batch2", "engine_001.json"), "r") as f:
        engine_df = pd.DataFrame(json.load(f))
    with open(os.path.join(datasets_dir, "Automind_batch2", "gps_001.json"), "r") as f:
        gps_df = pd.DataFrame(json.load(f))
    with open(os.path.join(datasets_dir, "Automind_batch2", "telemetry_001.json"), "r") as f:
        telemetry_df = pd.DataFrame(json.load(f))
        
    # Batch 3
    fuel_df = pd.read_excel(os.path.join(datasets_dir, "Automind_batch3", "fuel_transactions.xlsx"))
    claims_df = pd.read_csv(os.path.join(datasets_dir, "Automind_batch3", "insurance_claims.csv"))
    maint_df = pd.read_csv(os.path.join(datasets_dir, "Automind_batch3", "maintenance.csv"))
    with open(os.path.join(datasets_dir, "Automind_batch3", "weather_001.json"), "r") as f:
        weather_df = pd.DataFrame(json.load(f))

    # Helper function to convert to datetime
    def parse_dates(df, col_name):
        if col_name in df.columns:
            df[col_name] = pd.to_datetime(df[col_name], errors='coerce')
            
    # ----------------------------------------------------
    # 2. Build Dimension Tables (Gold Layer)
    # ----------------------------------------------------
    
    # dim_date
    print("Generating dim_date...")
    start_date = datetime(2020, 1, 1)
    end_date = datetime(2030, 12, 31)
    date_list = [start_date + timedelta(days=x) for x in range((end_date - start_date).days + 1)]
    date_records = []
    for d in date_list:
        date_records.append({
            "date_key": int(d.strftime("%Y%m%d")),
            "full_date": d.strftime("%Y-%m-%d"),
            "year": d.year,
            "quarter": (d.month - 1) // 3 + 1,
            "month": d.month,
            "month_name": d.strftime("%B"),
            "week_of_year": d.isocalendar()[1],
            "day_of_month": d.day,
            "day_of_week": d.isocalendar()[2],
            "day_name": d.strftime("%A"),
            "is_weekend": d.isocalendar()[2] in (6, 7),
            "is_holiday": False,
            "holiday_name": None,
            "fiscal_year": d.year,
            "fiscal_quarter": (d.month - 1) // 3 + 1,
            "fiscal_month": d.month
        })
    dim_date = pd.DataFrame(date_records)
    dim_date.to_sql("dim_date", conn, if_exists="replace", index=False)
    
    # dim_vehicle
    print("Building dim_vehicle...")
    dim_vehicle = vehicle_df.copy()
    dim_vehicle.rename(columns={
        "manufacturer": "make",
        "manufacturing_year": "year",
        "variant": "vehicle_type"
    }, inplace=True)
    
    parse_dates(dim_vehicle, "purchase_date")
    parse_dates(dim_vehicle, "last_service_date")
    
    # Add calculated attributes
    now = datetime.now()
    dim_vehicle["vehicle_age_years"] = dim_vehicle["year"].apply(lambda y: round(float(now.year - y), 1))
    dim_vehicle["vehicle_age_category"] = dim_vehicle["vehicle_age_years"].apply(
        lambda a: "New" if a < 3 else "Moderate" if a < 7 else "Old"
    )
    dim_vehicle["days_since_service"] = (now - dim_vehicle["last_service_date"]).dt.days
    dim_vehicle["days_since_service"] = dim_vehicle["days_since_service"].fillna(-1).astype(int)
    dim_vehicle["service_overdue"] = dim_vehicle["days_since_service"] > 180
    dim_vehicle["mileage_category"] = dim_vehicle["current_odometer_km"].apply(
        lambda m: "Low" if m < 50000 else "Medium" if m < 150000 else "High"
    )
    dim_vehicle.reset_index(inplace=True)
    dim_vehicle.rename(columns={"index": "vehicle_key"}, inplace=True)
    dim_vehicle["vehicle_key"] = dim_vehicle["vehicle_key"] + 1
    dim_vehicle.to_sql("dim_vehicle", conn, if_exists="replace", index=False)
    
    # dim_driver
    print("Building dim_driver...")
    dim_driver = driver_df.copy()
    parse_dates(dim_driver, "joining_date")
    dim_driver["tenure_years"] = dim_driver["joining_date"].apply(
        lambda jd: round(float((now - jd).days / 365.25), 1) if not pd.isnull(jd) else 0.0
    )
    dim_driver["experience_category"] = dim_driver["experience_years"].apply(
        lambda e: "Highly Experienced" if e >= 10 else "Experienced" if e >= 3 else "New Driver"
    )
    dim_driver["risk_indicator"] = dim_driver["experience_years"].apply(
        lambda e: "HIGH" if e < 2 else "MEDIUM" if e < 5 else "LOW"
    )
    dim_driver["is_veteran_driver"] = dim_driver["experience_years"] >= 15
    dim_driver.reset_index(inplace=True)
    dim_driver.rename(columns={"index": "driver_key"}, inplace=True)
    dim_driver["driver_key"] = dim_driver["driver_key"] + 1
    dim_driver.to_sql("dim_driver", conn, if_exists="replace", index=False)
    
    # dim_route
    print("Building dim_route...")
    dim_route = route_df.copy()
    dim_route["avg_speed_kmph"] = round((dim_route["distance_km"] / dim_route["estimated_duration_min"]) * 60, 1)
    dim_route["is_long_route"] = dim_route["distance_km"] > 150
    dim_route["route_efficiency"] = dim_route["avg_speed_kmph"].apply(
        lambda s: "Efficient" if s > 60 else "Moderate" if s > 40 else "Slow"
    )
    dim_route.reset_index(inplace=True)
    dim_route.rename(columns={"index": "route_key"}, inplace=True)
    dim_route["route_key"] = dim_route["route_key"] + 1
    dim_route.to_sql("dim_route", conn, if_exists="replace", index=False)
    
    # dim_weather
    print("Building dim_weather...")
    dim_weather = weather_df.copy()
    dim_weather.rename(columns={
        "temperature": "temperature_c",
        "humidity": "humidity_pct",
        "wind_speed": "wind_speed_kmph",
        "rainfall_mm": "precipitation_mm"
    }, inplace=True)
    
    # Flatten location dict to city, state, country
    if "location" in dim_weather.columns:
        dim_weather["city"] = dim_weather["location"].apply(lambda x: x.get("city") if isinstance(x, dict) else x)
        dim_weather["state"] = dim_weather["location"].apply(lambda x: x.get("state") if isinstance(x, dict) else "Kerala")
        dim_weather["country"] = dim_weather["location"].apply(lambda x: x.get("country") if isinstance(x, dict) else "India")
        dim_weather.drop(columns=["location"], inplace=True)
    else:
        dim_weather["city"] = "Kochi"
        dim_weather["state"] = "Kerala"
        dim_weather["country"] = "India"
        
    dim_weather["weather_severity"] = dim_weather["condition"].apply(
        lambda c: "SEVERE" if c in ("Stormy", "Snowy") else "ADVERSE" if c in ("Rainy", "Foggy") else "NORMAL"
    )
    dim_weather["is_adverse_weather"] = dim_weather["weather_severity"] != "NORMAL"
    dim_weather.reset_index(inplace=True)
    dim_weather.rename(columns={"index": "weather_key"}, inplace=True)
    dim_weather["weather_key"] = dim_weather["weather_key"] + 1
    dim_weather.to_sql("dim_weather", conn, if_exists="replace", index=False)
    
    # dim_location
    print("Building dim_location...")
    cities = pd.concat([route_df["source"], route_df["destination"]]).unique()
    location_records = []
    import hashlib
    for i, city in enumerate(cities):
        loc_id = hashlib.md5(city.encode('utf-8')).hexdigest()
        location_records.append({
            "location_key": i + 1,
            "location_id": loc_id,
            "city": city,
            "state": "Kerala",
            "country": "India",
            "postal_code": None,
            "region": "South",
            "location_type": "depot"
        })
    dim_location = pd.DataFrame(location_records)
    dim_location.to_sql("dim_location", conn, if_exists="replace", index=False)
    
    # Create key maps to map string IDs to integer surrogate keys
    v_key_map = dim_vehicle.set_index("vehicle_id")["vehicle_key"].to_dict()
    d_key_map = dim_driver.set_index("driver_id")["driver_key"].to_dict()
    r_key_map = dim_route.set_index("route_id")["route_key"].to_dict()
    w_key_map = dim_weather.set_index("weather_id")["weather_key"].to_dict()
    
    # ----------------------------------------------------
    # 3. Build Fact Tables (Gold Layer)
    # ----------------------------------------------------
    
    # fact_trip
    print("Building fact_trip...")
    fact_trip = trip_df.copy()
    parse_dates(fact_trip, "start_time")
    parse_dates(fact_trip, "end_time")
    
    fact_trip["vehicle_key"] = fact_trip["vehicle_id"].map(v_key_map)
    fact_trip["driver_key"] = fact_trip["driver_id"].map(d_key_map)
    fact_trip["route_key"] = fact_trip["route_id"].map(r_key_map)
    fact_trip["weather_key"] = fact_trip["weather_id"].map(w_key_map)
    
    fact_trip["start_date_key"] = fact_trip["start_time"].dt.strftime("%Y%m%d").fillna(-1).astype(int)
    fact_trip["end_date_key"] = fact_trip["end_time"].dt.strftime("%Y%m%d").fillna(-1).astype(int)
    
    fact_trip["duration_hours"] = (fact_trip["end_time"] - fact_trip["start_time"]).dt.total_seconds() / 3600.0
    fact_trip["duration_hours"] = round(fact_trip["duration_hours"].fillna(0.0), 2)
    
    # Approximate fuel and behavior measures if not present
    fact_trip["fuel_consumed_l"] = round(fact_trip["distance_km"] / 8.0, 2)  # 8 kmpl average
    fact_trip["fuel_efficiency_kmpl"] = 8.0
    fact_trip["idle_time_minutes"] = 15.0
    fact_trip["harsh_braking_count"] = 0
    fact_trip["rapid_acceleration_count"] = 0
    fact_trip["overspeed_count"] = 0
    fact_trip["trip_cost"] = round(fact_trip["distance_km"] * 12.0, 2)  # cost estimate
    fact_trip["toll_amount"] = 120.0
    fact_trip["is_completed"] = fact_trip["trip_status"] == "Completed"
    fact_trip["had_incident"] = False
    fact_trip["violated_speed"] = fact_trip["average_speed_kmph"] > 80
    
    fact_trip.to_sql("fact_trip", conn, if_exists="replace", index=False)
    
    # fact_telemetry
    print("Building fact_telemetry...")
    fact_telemetry = telemetry_df.copy()
    parse_dates(fact_telemetry, "timestamp")
    fact_telemetry["vehicle_key"] = fact_telemetry["vehicle_id"].map(v_key_map)
    fact_telemetry["driver_key"] = fact_telemetry["driver_id"].map(d_key_map)
    fact_telemetry["date_key"] = fact_telemetry["timestamp"].dt.strftime("%Y%m%d").fillna(-1).astype(int)
    
    # Ensure all measures are present
    if "coolant_temperature" not in fact_telemetry.columns and "engine_temperature" in fact_telemetry.columns:
        fact_telemetry["coolant_temperature"] = fact_telemetry["engine_temperature"]
    if "idle_time" not in fact_telemetry.columns:
        fact_telemetry["idle_time"] = 0
    
    fact_telemetry.to_sql("fact_telemetry", conn, if_exists="replace", index=False)
    
    # fact_driver_behavior
    print("Building fact_driver_behavior...")
    fact_driver_behavior = behavior_df.copy()
    parse_dates(fact_driver_behavior, "timestamp")
    fact_driver_behavior["vehicle_key"] = fact_driver_behavior["vehicle_id"].map(v_key_map)
    fact_driver_behavior["driver_key"] = fact_driver_behavior["driver_id"].map(d_key_map)
    fact_driver_behavior["date_key"] = fact_driver_behavior["timestamp"].dt.strftime("%Y%m%d").fillna(-1).astype(int)
    
    fact_driver_behavior.rename(columns={
        "behaviour_id": "behavior_id",
        "hard_cornering_count": "sharp_turn_count",
        "overspeed_events": "overspeed_duration_sec",
        "idle_time": "idle_duration_sec",
        "phone_usage": "phone_usage_duration_sec",
        "eco_driving_score": "behavior_score",
        "driver_fatigue_score": "risk_score"
    }, inplace=True)
    fact_driver_behavior["seatbelt_violation_count"] = fact_driver_behavior["seatbelt_status"].apply(lambda s: 0 if s == "Fastened" else 1)
    
    fact_driver_behavior.to_sql("fact_driver_behavior", conn, if_exists="replace", index=False)
    
    # fact_fuel_transaction
    print("Building fact_fuel_transaction...")
    fact_fuel_transaction = fuel_df.copy()
    parse_dates(fact_fuel_transaction, "timestamp")
    fact_fuel_transaction["vehicle_key"] = fact_fuel_transaction["vehicle_id"].map(v_key_map)
    fact_fuel_transaction["driver_key"] = 1  # default or join if driver info is present
    fact_fuel_transaction["date_key"] = fact_fuel_transaction["timestamp"].dt.strftime("%Y%m%d").fillna(-1).astype(int)
    fact_fuel_transaction["odometer_reading"] = 100000  # mock odometer reading
    fact_fuel_transaction["trip_distance_since_last_fuel"] = 450.0
    fact_fuel_transaction["fuel_efficiency_kmpl"] = round(fact_fuel_transaction["trip_distance_since_last_fuel"] / fact_fuel_transaction["fuel_quantity_l"], 2)
    
    fact_fuel_transaction.to_sql("fact_fuel_transaction", conn, if_exists="replace", index=False)
    
    # fact_maintenance
    print("Building fact_maintenance...")
    fact_maintenance = maint_df.copy()
    parse_dates(fact_maintenance, "service_date")
    fact_maintenance["vehicle_key"] = fact_maintenance["vehicle_id"].map(v_key_map)
    fact_maintenance["date_key"] = fact_maintenance["service_date"].dt.strftime("%Y%m%d").fillna(-1).astype(int)
    fact_maintenance["days_since_last_service"] = 90
    
    fact_maintenance.to_sql("fact_maintenance", conn, if_exists="replace", index=False)
    
    # fact_insurance_claim
    print("Building fact_insurance_claim...")
    fact_insurance_claim = claims_df.copy()
    parse_dates(fact_insurance_claim, "accident_timestamp")
    fact_insurance_claim["vehicle_key"] = fact_insurance_claim["vehicle_id"].map(v_key_map)
    fact_insurance_claim["driver_key"] = fact_insurance_claim["driver_id"].map(d_key_map)
    fact_insurance_claim["weather_key"] = 1
    fact_insurance_claim["date_key"] = fact_insurance_claim["accident_timestamp"].dt.strftime("%Y%m%d").fillna(-1).astype(int)
    
    # Handle missing columns in the raw CSV
    if "actual_repair_cost" not in fact_insurance_claim.columns:
        fact_insurance_claim["actual_repair_cost"] = fact_insurance_claim["estimated_repair_cost"] * 1.05
    if "days_to_settle" not in fact_insurance_claim.columns:
        fact_insurance_claim["days_to_settle"] = 14
        
    fact_insurance_claim["cost_variance"] = fact_insurance_claim["actual_repair_cost"] - fact_insurance_claim["estimated_repair_cost"]
    
    fact_insurance_claim.to_sql("fact_insurance_claim", conn, if_exists="replace", index=False)
    
    # ----------------------------------------------------
    # 4. Generate Pre-computed Aggregated Tables
    # ----------------------------------------------------
    
    # agg_maintenance_summary
    print("Aggregating agg_maintenance_summary...")
    cursor = conn.cursor()
    
    # Drop table if exists to allow re-seeding
    cursor.execute("DROP TABLE IF EXISTS agg_maintenance_summary")
    cursor.execute("""
        CREATE TABLE agg_maintenance_summary AS
        SELECT
            vehicle_key,
            CAST(strftime('%Y', service_date) AS INT) as year,
            (CAST(strftime('%m', service_date) AS INT) - 1) / 3 + 1 as quarter,
            COUNT(*) as total_maintenance_events,
            SUM(CASE WHEN service_type = 'Preventive' THEN 1 ELSE 0 END) as preventive_maintenance_count,
            SUM(CASE WHEN service_type = 'Breakdown' THEN 1 ELSE 0 END) as breakdown_count,
            SUM(labour_cost) as total_labour_cost,
            SUM(parts_cost) as total_parts_cost,
            SUM(total_cost) as total_cost,
            SUM(downtime_hours) as total_downtime_hours,
            AVG(total_cost) as avg_cost_per_event,
            AVG(downtime_hours) as avg_downtime_per_event_hours,
            SUM(CASE WHEN warranty_claim = 'Yes' THEN 1 ELSE 0 END) as warranty_claim_count
        FROM fact_maintenance
        GROUP BY vehicle_key, year, quarter
    """)
    
    # agg_fuel_summary
    print("Aggregating agg_fuel_summary...")
    cursor.execute("DROP TABLE IF EXISTS agg_fuel_summary")
    cursor.execute("""
        CREATE TABLE agg_fuel_summary AS
        SELECT
            vehicle_key,
            CAST(strftime('%Y', timestamp) AS INT) as year,
            CAST(strftime('%m', timestamp) AS INT) as month,
            COUNT(*) as total_transactions,
            SUM(fuel_quantity_l) as total_fuel_quantity_l,
            SUM(total_cost) as total_fuel_cost,
            AVG(fuel_price_per_l) as avg_fuel_price_per_l,
            AVG(fuel_efficiency_kmpl) as avg_fuel_efficiency_kmpl,
            SUM(trip_distance_since_last_fuel) as total_distance_km,
            SUM(total_cost) / NULLIF(SUM(trip_distance_since_last_fuel), 0) as cost_per_km
        FROM fact_fuel_transaction
        GROUP BY vehicle_key, year, month
    """)
    
    # agg_vehicle_daily
    print("Aggregating agg_vehicle_daily...")
    cursor.execute("DROP TABLE IF EXISTS agg_vehicle_daily")
    cursor.execute("""
        CREATE TABLE agg_vehicle_daily AS
        SELECT
            vehicle_key,
            start_date_key as date_key,
            COUNT(*) as total_trips,
            SUM(distance_km) as total_distance_km,
            SUM(duration_hours) as total_duration_hours,
            AVG(average_speed_kmph) as avg_speed_kmph,
            MAX(average_speed_kmph) as max_speed_kmph,
            SUM(fuel_consumed_l) as total_fuel_consumed_l,
            AVG(fuel_efficiency_kmpl) as avg_fuel_efficiency_kmpl,
            SUM(idle_time_minutes) as total_idle_time_minutes,
            SUM(harsh_braking_count) as total_harsh_braking,
            SUM(rapid_acceleration_count) as total_rapid_acceleration,
            SUM(overspeed_count) as total_overspeed_incidents,
            AVG(85.0) as avg_engine_health_score,
            SUM(trip_cost) as total_fuel_cost,
            SUM(duration_hours) as utilization_hours,
            (SUM(duration_hours) / 24.0) * 100 as utilization_pct
        FROM fact_trip
        GROUP BY vehicle_key, date_key
    """)
    
    # agg_driver_daily
    print("Aggregating agg_driver_daily...")
    cursor.execute("DROP TABLE IF EXISTS agg_driver_daily")
    cursor.execute("""
        CREATE TABLE agg_driver_daily AS
        SELECT
            driver_key,
            date_key,
            COUNT(DISTINCT trip_id) as total_trips,
            SUM(behavior_id) as safety_violations,
            AVG(behavior_score) as avg_behavior_score,
            AVG(risk_score) as avg_risk_score,
            SUM(CASE WHEN risk_score > 70 THEN 1 ELSE 0 END) as incidents_count
        FROM fact_driver_behavior
        GROUP BY driver_key, date_key
    """)
    
    # agg_route_summary
    print("Aggregating agg_route_summary...")
    cursor.execute("DROP TABLE IF EXISTS agg_route_summary")
    cursor.execute("""
        CREATE TABLE agg_route_summary AS
        SELECT
            route_key,
            COUNT(*) as total_trips,
            AVG(duration_hours) as avg_duration_hours,
            MIN(duration_hours) as min_duration_hours,
            MAX(duration_hours) as max_duration_hours,
            AVG(average_speed_kmph) as avg_speed_kmph,
            AVG(fuel_efficiency_kmpl) as avg_fuel_efficiency_kmpl,
            SUM(fuel_consumed_l) as total_fuel_consumed_l,
            SUM(CASE WHEN trip_status = 'Incident' THEN 1 ELSE 0 END) as incident_count,
            (SUM(CASE WHEN trip_status = 'Incident' THEN 1 ELSE 0 END) * 100.0) / COUNT(*) as incident_rate_pct,
            12.0 as avg_traffic_delay_minutes,
            94.5 as on_time_delivery_pct
        FROM fact_trip
        GROUP BY route_key
    """)
    
    conn.commit()
    conn.close()
    print("Local SQLite Lakehouse seeded successfully!")

if __name__ == "__main__":
    base_dir, _ = get_paths()
    db_file = os.path.join(base_dir, "backend", "axiogo_lakehouse.db")
    if os.path.exists(db_file):
        os.remove(db_file)
    seed_sqlite_lakehouse(db_file)
