namespace HoursControl.API.Domain.Exceptions;

public static class ErrorMessages
{
    public static class Errors
    {
        
    }
    
    public static class Validation
    {
        public const string NamePropRequired = "A propriedade Nome é obrigatória.";
        public const string NameTooShort = "A propriedade Nome deve ter pelo menos 3 caracteres.";
        public const string NameTooLong = "A propriedade Nome não pode exceder 100 caracteres.";
    }
}