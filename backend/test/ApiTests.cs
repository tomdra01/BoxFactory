using FullBackendTestProject.Controllers;
using Infrastructure.DataModels;
using Microsoft.AspNetCore.Mvc;
using Service;

namespace test;

using Xunit;
using Moq;
using System.Collections.Generic;
using System.Linq;

public class ApiTests
{
    private readonly Mock<IService> _mockService;
    private readonly BoxController _controller;

    public ApiTests()
    {
        _mockService = new Mock<IService>(); 
        _controller = new BoxController(_mockService.Object);
    }

    [Fact]
    public void GetBoxes_ReturnsAllBoxes()
    {
        // Arrange
        var boxes = new List<Box> { new Box("S", 10), new Box("M", 20) }; 
        _mockService.Setup(service => service.GetAllBoxes()).Returns(boxes);

        // Act
        var result = _controller.GetBoxes();

        // Assert
        Assert.Equal(boxes.Count, result.Count());
    }
    

    [Fact]
    public void PostBox_CreatesBox()
    {
        // Arrange
        _mockService.Setup(service => service.CreateBox(It.IsAny<Box>())).Returns(new Box("S", 10));

        // Act
        ActionResult<Box> actionResult = _controller.PostBox(new Box(null, 10));

        // Assert
        Assert.IsType<BadRequestObjectResult>(actionResult.Result);
    }

    [Fact]
    public void UpdateBox_UpdatesAndReturnsBox()
    {
        // Arrange
        var updatedBox = new Box("M", 20);
        _mockService.Setup(service => service.UpdateBox(1, It.IsAny<Box>())).Returns(new Box("M", 20));

        // Act
        ActionResult<Box> actionResult = _controller.UpdateBox(updatedBox, 1);
        OkObjectResult okResult = actionResult.Result as OkObjectResult;
        Box result = okResult.Value as Box;

        // Assert
        Assert.NotNull(okResult);
        Assert.Equal(updatedBox.Size, result.Size);
        Assert.Equal(updatedBox.Price, result.Price);
    }

    [Fact]
    public void DeleteBox_ReturnsDeletedBox()
    {
        // Arrange
        var deletedBox = new object();
        _mockService.Setup(service => service.DeleteBox(1)).Returns(deletedBox);

        // Act
        var result = _controller.DeleteBox(1);

        // Assert
        Assert.Equal(deletedBox, result);
    }

    [Fact]
    public void GetBoxById_ReturnsNotFound_WhenBoxDoesNotExist()
    {
        // Arrange
        _mockService.Setup(service => service.GetBoxById(99)).Returns((Box)null);

        // Act
        ActionResult<Box> actionResult = _controller.GetBoxById(99);

        // Assert
        Assert.IsType<NotFoundObjectResult>(actionResult.Result);
    }

    [Fact]
    public void PostBox_ReturnsBadRequest_WhenInputIsInvalid()
    {
        // Arrange
        _controller.ModelState.AddModelError("Size", "Size is required");

        // Act
        var result = _controller.PostBox(new Box(null, 10));

        // Assert
        Assert.IsType<BadRequestObjectResult>(result.Result);
    }
    
    [Fact]
    public void DeleteBox_ReturnsNotFound_WhenBoxDoesNotExist()
    {
        // Arrange
        _mockService.Setup(service => service.DeleteBox(99)).Returns((object)null);

        // Act
        var result = _controller.DeleteBox(99);

        // Assert
        Assert.Null(result);
    }
}