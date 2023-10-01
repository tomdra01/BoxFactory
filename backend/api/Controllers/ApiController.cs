using Infrastructure.DataModels;
using Microsoft.AspNetCore.Mvc;
using Service; 

namespace FullBackendTestProject.Controllers
{
    [ApiController]
    public class BoxController : ControllerBase
    {
        private readonly Service.Service _service;

        public BoxController(Service.Service service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("/api/boxes")]
        public IEnumerable<Box> GetBoxes()
        {
            return _service.GetAllBoxes();
        }

        [HttpPost]
        [Route("/api/box")]
        public Box PostBox([FromBody] Box box)
        {
            Box b = new Box(box.Size, box.Price);
            return _service.CreateBox(b);
        }

        [HttpPut]
        [Route("/api/box/{boxId}")]
        public Box UpdateBox([FromBody] Box box, [FromRoute] int boxId)
        {
            Box b = new Box(box.Size, box.Price);
            return _service.UpdateBox(boxId, b);
        }

        [HttpDelete]
        [Route("/api/box/{boxId}")]
        public object DeleteBox([FromRoute] int boxId)
        {
            return _service.DeleteBox(boxId);
        }
    }
}