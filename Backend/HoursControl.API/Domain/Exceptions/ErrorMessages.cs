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

        public const string EstimatedHours = "O campo \"Horas estimadas de trabalho\" deve conter um valor entre 1 e 12.";
        public const string SquadIdInvalid = "O squad informado não é válido.";
        public const string InvalidId = "O ID informado não é válido.";
        public const string InvalidEndDate = "A data de término deve ser maior ou igual à data de início.";

        public const string DescriptionRequired = "A descrição é obrigatória.";
        public const string SpentHoursInvalid = "As horas gastas devem ser maiores que zero.";
        public const string EmployeeIdInvalid = "O funcionário informado não é válido.";
    }
}