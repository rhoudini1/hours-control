namespace HoursControl.API.Endpoints;

public static class EndpointsRoutes
{
    private const string ApiBase = "api";

    public static class Squads
    {
        private const string Base = $"{ApiBase}/squad";
        
        public const string Create = Base;
    }
}