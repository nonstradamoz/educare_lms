const fs = require('fs');

// Patch Controller
let ctrl = fs.readFileSync('src/auth/auth.controller.ts', 'utf8');
ctrl = ctrl.replace("import { LoginDto } from './dto/login.dto';", "import { LoginDto } from './dto/login.dto';\nimport { SignupDto } from './dto/signup.dto';");

const signupEndpoint = `
  @Post('signup')
  @ApiOperation({ summary: 'Register a new admin user and login' })
  @ApiResponse({ status: 201, description: 'Signup successful' })
  async signup(@Body() signupDto: SignupDto, @Res({ passthrough: true }) res: Response) {
    const { access_token, user } = await this.authService.signup(signupDto);
    
    res.cookie('AccessToken', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    return { message: 'Signup successful', user };
  }
`;
ctrl = ctrl.replace(/}\n$/, signupEndpoint + '\n}\n');
fs.writeFileSync('src/auth/auth.controller.ts', ctrl, 'utf8');

// Patch Service
let svc = fs.readFileSync('src/auth/auth.service.ts', 'utf8');
svc = svc.replace("import { LoginDto } from './dto/login.dto';", "import { LoginDto } from './dto/login.dto';\nimport { SignupDto } from './dto/signup.dto';\nimport { BadRequestException } from '@nestjs/common';");

const signupLogic = `
  async signup(signupDto: SignupDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: signupDto.email } });
    if (existing) throw new BadRequestException('User already exists');

    let adminRole = await this.prisma.role.findUnique({ where: { name: 'Admin' } });
    if (!adminRole) {
      adminRole = await this.prisma.role.create({ data: { name: 'Admin', description: 'System Administrator' } });
    }

    const hashedPassword = await argon2.hash(signupDto.password);
    const user = await this.prisma.user.create({
      data: {
        email: signupDto.email,
        password: hashedPassword,
        firstName: signupDto.firstName,
        lastName: signupDto.lastName,
        roleId: adminRole.id
      },
      include: { role: true }
    });

    const payload = { email: user.email, sub: user.id, role: user.role.name };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.name,
      }
    };
  }
`;
svc = svc.replace(/}\n$/, signupLogic + '\n}\n');
fs.writeFileSync('src/auth/auth.service.ts', svc, 'utf8');

