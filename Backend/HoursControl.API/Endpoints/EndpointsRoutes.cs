namespace HoursControl.API.Endpoints;

public static class EndpointsRoutes
{
    private const string ApiBase = "api";

    public static class Squads
    {
        private const string Base = $"{ApiBase}/squad";
        
        public const string Create = Base;
        public const string List = Base;
    }

    public static class Employees
    {
        private const string Base = $"{ApiBase}/employee";
        
        public const string Create = Base;
    }

    public static class Reports
    {
        private const string Base = $"{ApiBase}/report";

        public const string Create = Base;
    }
}