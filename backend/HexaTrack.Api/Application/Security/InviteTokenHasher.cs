using System.Security.Cryptography;
using System.Text;

namespace HexaTrack.Api.Application.Security;

public static class InviteTokenHasher
{
    public static string Hash(string plainToken) =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(plainToken))).ToLowerInvariant();
}
