namespace HexaTrack.Api.Application.Security;

public sealed class TooManyRequestsException(string message) : Exception(message);
