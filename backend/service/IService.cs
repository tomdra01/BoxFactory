using Infrastructure.DataModels;

namespace Service;

public interface IService
{
    Box GetBoxById(int id);
    IEnumerable<Box> GetAllBoxes();
    Box CreateBox(Box box);
    Box UpdateBox(int boxId, Box box);
    object DeleteBox(int boxId);
}