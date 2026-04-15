using Microsoft.AspNetCore.Mvc;
using test_project_api.Data;

namespace test_project_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll() => Ok(DataStore.Categories);
}
