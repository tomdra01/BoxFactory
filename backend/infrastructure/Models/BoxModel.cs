namespace Infrastructure.DataModels
{
    public class Box
    {
        public int BoxId { get; set; }
        public string Size { get; set; }
        public decimal Price { get; set; }

        public Box() { }

        public Box(string size, decimal price)
        {
            Size = size;
            Price = price;
        }
    }
}