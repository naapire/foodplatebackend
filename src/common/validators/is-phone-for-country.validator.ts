// src/common/validators/is-phone-for-country.validator.ts
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const GH_PREFIXES = new Set([
  // MTN
  '024', '054', '055', '059', '025', '053',
  // Telecel
  '020', '050',
  // AirtelTigo
  '027', '057', '026', '056',
  // Expresso
  '028',
]);

/**
 * Validates a phone number against the country code property.
 * Usage: @IsPhoneForCountry('phoneCountryCode') phoneNumber: string;
 */
@ValidatorConstraint({ name: 'isPhoneForCountry', async: false })
export class IsPhoneForCountryConstraint implements ValidatorConstraintInterface {
  validate(phoneValue: any, args: ValidationArguments) {
    // if phone not provided, let other decorators (IsOptional) handle presence
    if (phoneValue === undefined || phoneValue === null || phoneValue === '') {
      return true;
    }

    const [countryProp] = args.constraints as [string | undefined];
    const obj: any = args.object as any;
    const countryCode = countryProp ? obj[countryProp] : undefined;

    // If country code not given, don't validate country-specific rules
    if (!countryCode) return true;

    // For Ghana (233) we expect local format starting with leading 0, e.g. 0591552809 (10 digits)
    if (String(countryCode).replace(/\D/g, '') === '233') {
      // Normalise: remove spaces, dashes, plus signs
      const digitsOnly = String(phoneValue).replace(/\D/g, '');

      // If user supplied country code in the number (e.g. 233591552809 or +233591552809),
      // convert to local leading-zero format by detecting leading 233 and prefixing 0.
      let normalized = digitsOnly;
      if (normalized.startsWith('233') && normalized.length === 12) {
        // 233 + 9 digits -> drop 233 and prefix 0 to get 10-digit local form
        normalized = '0' + normalized.slice(3);
      }

      // For our desired local format we want exactly 10 digits and start with an allowed prefix
      if (!/^\d{10}$/.test(normalized)) return false;

      const prefix = normalized.slice(0, 3); // first three digits
      return GH_PREFIXES.has(prefix);
    }

    // For other countries we don't validate here (pass)
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const [countryProp] = args.constraints as [string | undefined];
    const obj: any = args.object as any;
    const countryCode = countryProp ? obj[countryProp] : undefined;
    if (String(countryCode).replace(/\D/g, '') === '233') {
      return `Invalid Ghana phone number. Expected 10 digits in local format (e.g. 0591234567) and prefix must be one of: ${Array.from(
        GH_PREFIXES,
      ).join(', ')}`;
    }
    return 'Invalid phone number for selected country';
  }
}

/**
 * Decorator factory.
 * @param countryPropName - name of the property on the object containing country code (default: 'phoneCountryCode')
 * @param validationOptions - optional class-validator options
 */
export function IsPhoneForCountry(
  countryPropName = 'phoneCountryCode',
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [countryPropName],
      validator: IsPhoneForCountryConstraint,
    });
  };
}
