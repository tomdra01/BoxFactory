using Infrastructure.DataModels;
using Microsoft.AspNetCore.Mvc;
using Service; 

namespace FullBackendTestProject.Controllers
{
    [ApiController]
    public class BoxController : ControllerBase
    {
        private readonly Service.IService _service;

        public BoxController(IService service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("/api/boxes")]
        public IEnumerable<Box> GetBoxes()
        {
            return _service.GetAllBoxes();
            
        }
        
        [HttpGet]
        [Route("/api/box/{boxId}")]
        public ActionResult<Box> GetBoxById([FromRoute] int boxId)
        {
            Box box = _service.GetBoxById(boxId);
            if (box == null)
            {
                return NotFound("Box not found");
            }
            return Ok(box);
        }

        [HttpPost]
        [Route("/api/box")]
        public ActionResult<Box> PostBox([FromBody] Box box)
        {
            if (box == null || string.IsNullOrEmpty(box.Size))
            {
                return BadRequest("Invalid input");
            }

            Box b = new Box(box.Size, box.Price);
            return Ok(_service.CreateBox(b));
        }

        [HttpPut]
        [Route("/api/box/{boxId}")]
        public ActionResult<Box> UpdateBox([FromBody] Box box, [FromRoute] int boxId)
        {
            if (box == null || !ModelState.IsValid)
            {
                return BadRequest("Invalid input");
            }

            Box updatedBox = new Box(box.Size, box.Price);
            updatedBox = _service.UpdateBox(boxId, updatedBox);

            if (updatedBox == null)
            {
                return NotFound();
            }

            return Ok(updatedBox);
        }

        [HttpDelete]
        [Route("/api/box/{boxId}")]
        public object DeleteBox([FromRoute] int boxId)
        {
            return _service.DeleteBox(boxId);
        }
    }
}