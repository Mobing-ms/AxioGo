import pytest

from app.services.sql_validator import SqlValidationError, validate_sql


def test_valid_select_passes():
    result = validate_sql("SELECT * FROM datasets")
    assert result.startswith("SELECT")
    assert "LIMIT" in result


def test_select_with_existing_limit_not_duplicated():
    result = validate_sql("SELECT * FROM datasets LIMIT 10")
    assert result.count("LIMIT") == 1


def test_rejects_empty_sql():
    with pytest.raises(SqlValidationError):
        validate_sql("")


def test_rejects_insert():
    with pytest.raises(SqlValidationError):
        validate_sql("INSERT INTO datasets VALUES (1)")


def test_rejects_delete():
    with pytest.raises(SqlValidationError):
        validate_sql("DELETE FROM datasets")


def test_rejects_drop():
    with pytest.raises(SqlValidationError):
        validate_sql("DROP TABLE datasets")


def test_rejects_multiple_statements():
    with pytest.raises(SqlValidationError):
        validate_sql("SELECT * FROM datasets; DROP TABLE datasets")


def test_rejects_non_select_when_read_only():
    with pytest.raises(SqlValidationError):
        validate_sql("UPDATE datasets SET name = 'x'")
