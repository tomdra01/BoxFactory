namespace test;

public class PlaywrightTests
{
    private IPlaywright _playwright;
    private IBrowser _browser;
    private IPage _page;

    [SetUp]
    public async Task Setup()
    {
        _playwright = await Playwright.CreateAsync();
        _browser = await _playwright.Chromium.LaunchAsync();
        _page = await _browser.NewPageAsync();
        await _page.GotoAsync("http://localhost:4200/home");
    }

    [Test]
    public async Task TestAddButtonExistence()
    {
        var elementButton = await _page.QuerySelectorAsync(".add-button");
        Assert.NotNull(elementButton);
    }
    
    [Test]
    public async Task TestHomeButtonExistence()
    {
        var elementButton = await _page.QuerySelectorAsync(".home-button");
        Assert.NotNull(elementButton);
    }

    [Test]
    public async Task TestAddButtonClick()
    {
        await _page.ClickAsync(".add-button");

        await _page.WaitForURLAsync("http://localhost:4200/add");
    }
    
    [Test]
    public async Task TestHomeButtonClick()
    {
        await _page.ClickAsync(".home-button"); 
    }

    [TearDown]
    public async Task TearDown()
    {
        await _browser.CloseAsync();
        _playwright.Dispose();
    }
}