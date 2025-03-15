using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

public class FirebaseAuthHandler : JwtBearerHandler
{
    public FirebaseAuthHandler(IOptionsMonitor<JwtBearerOptions> options, ILoggerFactory logger, UrlEncoder encoder, ISystemClock clock)
        : base(options, logger, encoder, clock)
    {
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var authHeader = Request.Headers["Authorization"].ToString();
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
        {
            return AuthenticateResult.Fail("Authorization header is missing or invalid");
        }

        var idToken = authHeader.Substring("Bearer ".Length).Trim();

        try
        {
            // Validate Firebase ID Token
            var decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken);
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, decodedToken.Uid),
                new Claim(ClaimTypes.NameIdentifier, decodedToken.Uid)
            };

            var identity = new ClaimsIdentity(claims, "Firebase");
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, "Firebase");

            return AuthenticateResult.Success(ticket);
        }
        catch (Exception ex)
        {
            return AuthenticateResult.Fail(ex);
        }
    }
}
