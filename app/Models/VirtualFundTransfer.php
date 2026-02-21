<?php

namespace App\Models;

use App\Traits\HasCreator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VirtualFundTransfer extends Model
{
    use HasCreator;

    protected $fillable = [
        'from_fund_id',
        'to_fund_id',
        'amount',
        'description',
        'created_by',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function fromFund(): BelongsTo
    {
        return $this->belongsTo(VirtualFund::class, 'from_fund_id');
    }

    public function toFund(): BelongsTo
    {
        return $this->belongsTo(VirtualFund::class, 'to_fund_id');
    }
}
