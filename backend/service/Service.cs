using System;
using System.Collections.Generic;
using infrastructure;
using Infrastructure; 
using Infrastructure.DataModels; 

namespace Service
{
    public class Service : IService
    {
        private readonly Repository _repository;

        public Service(Repository repository)
        {
            _repository = repository;
        }
        
        public Service()
        {}

        public IEnumerable<Box> GetAllBoxes()
        {
            try
            {
                return _repository.GetAllBoxes();
            }
            catch (Exception)
            {
                throw new Exception("Could not get boxes");
            }
        }
        
        public Box GetBoxById(int boxId)
        {
            try
            {
                return _repository.GetBoxById(boxId);
            }
            catch (Exception)
            {
                throw new Exception("Could not get box by ID");
            }
        }

        public Box CreateBox(Box box)
        {
            if (box == null)
            {
                throw new ArgumentNullException(nameof(box), "Box data is null");
            }

            if (string.IsNullOrEmpty(box.Size) || !IsValidSize(box.Size))
            {
                throw new ArgumentException("Invalid box size", nameof(box.Size));
            }

            if (box.Price < 0)
            {
                throw new ArgumentException("Price must be a non-negative value", nameof(box.Price));
            }

            return _repository.CreateBox(box);
        }

        private static bool IsValidSize(string size)
        {
            var validSizes = new List<string> { "S", "M", "L", "XL"};
            return validSizes.Contains(size);
        }

        public Box UpdateBox(int boxId, Box box)
        {
            return _repository.UpdateBox(boxId, box);
        }

        public object DeleteBox(int boxId)
        {
            return _repository.DeleteBox(boxId);
        }
    }
}