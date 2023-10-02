using Dapper;
using Infrastructure.DataModels; 
using Npgsql;
using System.Collections.Generic;

namespace Infrastructure
{
    public class Repository
    {
        private readonly NpgsqlDataSource _dataSource;

        public Repository(NpgsqlDataSource dataSource)
        {
            _dataSource = dataSource;
        }
        public IEnumerable<Box> GetAllBoxes()
        {
            const string sql = "SELECT * FROM boxes;";
            using(var conn = _dataSource.OpenConnection())
            {
                return conn.Query<Box>(sql);
            }
        }
        
        public Box GetBoxById(int boxId)
        {
            const string sql = "SELECT * FROM boxes WHERE boxid = @BoxId;";
            using (var conn = _dataSource.OpenConnection())
            {
                return conn.QuerySingleOrDefault<Box>(sql, new { BoxId = boxId });
            }
        }

        public Box CreateBox(Box box)
        {
            const string sql = "INSERT INTO boxes(size, price) VALUES(@Size, @Price) RETURNING *;";
            using(var conn = _dataSource.OpenConnection())
            {
                return conn.QuerySingle<Box>(sql, new { Size = box.Size, Price = box.Price });
            }
        }

        public Box UpdateBox(int boxId, Box box)
        {
            const string sql = "UPDATE boxes SET size = @Size, price = @Price WHERE boxid = @BoxId RETURNING *;";
            using(var conn = _dataSource.OpenConnection())
            {
                return conn.QuerySingleOrDefault<Box>(sql, new { BoxId = boxId, Size = box.Size, Price = box.Price });
            }
        }

        public object DeleteBox(int boxId)
        {
            const string sql = "DELETE FROM boxes WHERE boxid = @BoxId RETURNING *;";
            using(var conn = _dataSource.OpenConnection())
            {
                return conn.QuerySingleOrDefault<Box>(sql, new { BoxId = boxId });
            }
        }
    }
}