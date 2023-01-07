# Authentication

## Login

User can login using this endpoint by entering their credentials and get back a JWT token

### Request

```javascript
POST /api/user/login
{
    data: {
        email: String,
        password: String
    }
}
```

### Response

#### Success

```javascript
{
    status: 200,
    data: {
        message: String,
        token: String
    }
}
```

#### Error

```javascript
{
    status: Number {400 || 404 || 422 || 500},
    data: {
        message: String,
        error: Object
    }
}
```

## Register

User can register using this endpoint by entering their information and get back a JWT token

### Request

```javascript
POST /api/user/register
{
    data: {
        name: String
        email: String,
        phoneNo: String,
        password: String,
    }
}
```

### Response

#### Success

```javascript
{
    status: 201,
    data: {
        message: String,
        token: String
    }
}
```

#### Error

```javascript
{
    status: Number {422 || 500},
    data: {
        message: String,
        error: Object
    }
}
```

# User

## Get Current (Logged In) User's Profile

Send logged in user's JWT token to get their profile details

### Request

```javascript
GET /api/user
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
```

### Response

#### Success

```javascript
{
    status: 200,
    data: {
        message: String,
        user: Object
    }
}
```

#### Error

```javascript
{
    status: Number {404 || 500},
    data: {
        message: String,
        error: Object
    }
}
```

## Get Current User's Bookings

Get all the bookings of the currently logged in user

### Request

```javascript
GET /api/user/bookings
{
    headers: {
        Authorization: `Bearer ${token}`,
    }
}
```

### Response

#### Success

```javascript
{
    status: 200,
    data: {
        message: String,
        bookings: Object[]
    }
}
```

#### Error

```javascript
{
    status: Number {404 || 500},
    data: {
        message: String,
        error: Object
    }
}
```

# Booking

## Create A Booking

Create a new booking

### Request

```javascript
POST /api/bookings/
{
    headers: {
        Authorization: `Bearer ${token}`,
    }
    data: {
        busId: String,
        bookingDate: Date,
        status: String,
        source: String,
        destination: String,
        seatNo: Number,
        amount: Number,
        transactionID: String // OPTIONAL : It will store the transaction ID of the payment gateway
    }
}
```

### Response

#### Success

```javascript
{
    status: 201,
    data: {
        message: String,
        booking: Object[]
    }
}
```

#### Error

```javascript
{
    status: Number {404 || 422 || 500},
    data: {
        message: String,
        error: Object
    }
}
```

## Cancel A Booking

Cancel a previous but not completed booking

### Request

```javascript
PATCH /api/bookings/cancel/:bookingId
{
    headers: {
        Authorization: `Bearer ${token}`,
    }
}
```

### Response

#### Success

```javascript
{
    status: 200,
    data: {
        message: String,
    }
}
```

#### Error

```javascript
{
    status: Number {404 || 500},
    data: {
        message: String,
        error: Object
    }
}
```

## Mark Booking As Completed

Mark a booking as completed

### Request

```javascript
PATCH /api/admin/bookings/complete/:bookingId
{
    headers: {
        Authorization: `Bearer ${token}`,
    }
}
```

### Response

#### Success

```javascript
{
    status: 200,
    data: {
        message: String,
    }
}
```

#### Error

```javascript
{
    status: Number {401 || 404 || 500},
    data: {
        message: String,
        error: Object
    }
}
```

## Get All Upcoming Bookings

Get all bookings that are yet to begin

### Request

```javascript
{
    GET /api/admin/bookings/upcoming
    {
        headers: {
            Authorization: `Bearer ${token}`
        },
    }
}
```

### Response

#### Success

```javascript
{
    status: 200,
    data: {
        message: String,
        upcomingBookings: Object[]
    }
}
```

#### Error

```javascript
{
    status: Number {401 || 500},
    data: {
        message: String,
        error: Object
    }
}
```

## Get All Completed Bookings

Get all bookings that are completed

### Request

```javascript
{
    GET /api/admin/bookings/completed
    {
        headers: {
            Authorization: `Bearer ${token}`
        },
    }
}
```

### Response

#### Success

```javascript
{
    status: 200,
    data: {
        message: String,
        completedBookings: Object[]
    }
}
```

#### Error

```javascript
{
    status: Number {401 || 500},
    data: {
        message: String,
        error: Object
    }
}
```

## Get All Cancelled Bookings

Get all bookings that have been cancelled

### Request

```javascript
{
    GET /api/admin/bookings/cancelled
    {
        headers: {
            Authorization: `Bearer ${token}`
        },
    }
}
```

### Response

#### Success

```javascript
{
    status: 200,
    data: {
        message: String,
        cancelledBookings: Object[]
    }
}
```

#### Error

```javascript
{
    status: Number {402|| 500},
    data: {
        message: String,
        error: Object
    }
}
```

## Get All Bookings For A Bus

Get all bookings for a specific bus

### Request

```javascript
{
    GET /api/admin/bookings/bus/:busId
    {
        headers: {
            Authorization: `Bearer ${token}`
        },
    }
}
```

### Response

#### Success

```javascript
{
    status: 200,
    data: {
        message: String,
        bookings: Object[]
    }
}
```

#### Error

```javascript
{
    status: Number {402 || 404 || 500},
    data: {
        message: String,
        error: Object
    }
}
```

# Coupons

## Create A Coupon

Create a new coupon

### Request

```javascript
POST /api/admin/coupons
    headers: {
        Authorization: `Bearer ${token}`
    },
    data: {
        discountPercentage: Number,
        validBefore: Date,
        couponName: String,
    }
}
```

### Response

#### Success

```javascript
{
    status: 201,
    data: {
        message: String,
        coupon: Object
    }
}
```

#### Error

```javascript
{
    status: Number {402 || 422 || 500},
    data: {
        message: String,
        error: Object
    }
}
```

## Delete A Coupon

Delete a coupon

### Request

```javascript
DELETE /api/admin/coupons/:couponId
{
    headers: {
        Authorization: `Bearer ${token}`
    },
}
```

### Response

#### Success

```javascript
{
    status: 200,
    data: {
        message: String
    }
}
```

#### Error

```javascript
{
    status: Number {402 || 404|| 500},
    data: {
        message: String,
        error: Object
    }
}
```

## Get All Valid Coupons

Get all valid coupons

### Request

```javascript
{
  GET /api/coupons/
  headers: {
    Authorization: `Bearer ${token}`;
  }
}
```

### Response

#### Success

```javascript
{
    status: 200,
    data: {
        message: String,
        coupons: Object[]
    }
}
```

#### Error

```javascript
{
    status: Number {402 || 500},
    data: {
        message: String,
        error: Object
    }
}
```

# Bus

## Add A Bus

Add a new bus

### Request

```javascript
POST /api/admin/bus
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
        name: String,
        busType: String,
        cities: [{
            cityName: String,
            departureTime: Date
        }],
        numberOfSeats: Number,
        dateOfTravel: Date
    }
  };
```

### Response

#### Success

```javascript
{
    status: 201,
    data: {
        message: String,
        bus: Object
    }
}
```

#### Error

```javascript
{
    status: Number {402 || 422 || 500},
    data: {
        message: String,
        error: Object
    }
}
```

## Remove A Bus

Remove a bus

### Request

```javascript
DELETE /api/admin/bus/:busId
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
```

### Response

#### Success

```javascript
{
    status: 200,
    data: {
        message: String
    }
}
```

#### Error

```javascript
{
    status: Number {402 || 404 || 500},
    data: {
        message: String,
        error: Object
    }
}
```

## Get Available Buses

Get all available buses for a journey

### Request

```javascript
GET /api/bus
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
        sourceCity: String,
        destinationCity: String,
        dateOfTravel: Date
    }
  };
```

### Response

#### Success

```javascript
{
    status: 200,
    data: {
        message: String,
        buses: Object[]
    }
}
```

#### Error

```javascript
{
    status: Number {404 || 422 || 500},
    data: {
        message: String,
        error: Object
    }
}
```
