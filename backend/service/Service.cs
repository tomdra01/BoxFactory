using System;
using System.Collections.Generic;
using infrastructure;
using Infrastructure; 
using Infrastructure.DataModels; 

namespace Service
{
    public class Service
    {
        private readonly Repository _repository;

        public Service(Repository repository)
        {
            _repository = repository;
        }

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
            return _repository.CreateBox(box);
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